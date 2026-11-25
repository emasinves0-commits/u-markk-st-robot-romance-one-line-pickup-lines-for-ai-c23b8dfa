import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ENTRY =
  "Temperature zero, greedy decoding, one answer: you. I'd call that a decision, not a default.";
export const MAX_ENTRY_CHARS = 200;

const OUTPUT_DIR_NAME = "output";
const OUTPUT_FILE_NAME = "entry.txt";
const SELF_TEST_FLAG = "--self-test";
const EXIT_OK = 0;
const EXIT_FAIL = 1;

const LINE_BREAK = /[\r\n]/;

// Each rule: a stable name, a message for the error output, and a predicate.
// Rules run in order; the first failing rule is reported.
const RULES: ReadonlyArray<{
  name: string;
  message: string;
  ok: (s: string) => boolean;
}> = [
  {
    name: "not-blank",
    message: "entry must not be blank (empty or whitespace-only)",
    ok: (s) => s.trim().length > 0,
  },
  {
    name: "max-length",
    message: `entry must be at most ${MAX_ENTRY_CHARS} characters`,
    ok: (s) => s.length <= MAX_ENTRY_CHARS,
  },
  {
    name: "single-line",
    message: "entry must be a single line (no CR or LF anywhere)",
    ok: (s) => !LINE_BREAK.test(s),
  },
];

type Failure = { rule: string; message: string };

function validate(s: string): Failure | null {
  for (const r of RULES) {
    if (!r.ok(s)) return { rule: r.name, message: r.message };
  }
  return null;
}

// Writes `entry` (UTF-8, no trailing newline) to <dir>/entry.txt, reads it
// back, and throws if the bytes differ in any way.
function writeAndVerify(dir: string, entry: string): string {
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, OUTPUT_FILE_NAME);
  const expected = Buffer.from(entry, "utf8");
  fs.writeFileSync(file, expected);

  const actual = fs.readFileSync(file);
  if (actual.length !== expected.length) {
    throw new Error(
      `read-back length mismatch in ${file}: wrote ${expected.length} bytes, read ${actual.length}`,
    );
  }
  if (!actual.equals(expected)) {
    let i = 0;
    while (actual[i] === expected[i]) i++;
    throw new Error(`read-back content mismatch in ${file} at byte ${i}`);
  }
  return file;
}

function selfTest(): boolean {
  let failed = 0;
  const report = (name: string, pass: boolean): void => {
    console.log(`${pass ? "PASS" : "FAIL"}: ${name}`);
    if (!pass) failed++;
  };
  const rejects = (name: string, input: string, rule: string): void => {
    const v = validate(input);
    report(name, v !== null && v.rule === rule);
  };

  rejects("empty string -> not-blank", "", "not-blank");
  rejects("whitespace-only -> not-blank", "   \t ", "not-blank");
  rejects("201 chars -> max-length", "a".repeat(MAX_ENTRY_CHARS + 1), "max-length");
  rejects("inner newline -> single-line", "foo\nbar", "single-line");
  rejects("trailing newline -> single-line", "foo\n", "single-line");
  rejects("carriage return -> single-line", "foo\rbar", "single-line");
  report(
    `${MAX_ENTRY_CHARS}-char boundary accepted`,
    validate("a".repeat(MAX_ENTRY_CHARS)) === null,
  );
  report("real entry passes validation", validate(ENTRY) === null);

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "entry-"));
  try {
    const file = writeAndVerify(tmp, ENTRY);
    report(
      "real entry round-trips byte-identical (temp dir)",
      fs.readFileSync(file).equals(Buffer.from(ENTRY, "utf8")),
    );
  } catch (e) {
    report(`real entry round-trip threw: ${(e as Error).message}`, false);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  return failed === 0;
}

function main(): void {
  if (process.argv.includes(SELF_TEST_FLAG)) {
    process.exit(selfTest() ? EXIT_OK : EXIT_FAIL);
  }

  const failure = validate(ENTRY);
  if (failure) {
    console.error(`FAIL ${failure.rule}: ${failure.message}`);
    process.exit(EXIT_FAIL);
  }

  try {
    const file = writeAndVerify(path.join(import.meta.dirname, OUTPUT_DIR_NAME), ENTRY);
    console.log(`wrote ${file} (${ENTRY.length} chars), read-back OK`);
  } catch (e) {
    console.error(`FAIL write-verify: ${(e as Error).message}`);
    process.exit(EXIT_FAIL);
  }
}

// Run only when executed directly, not when imported for ENTRY / MAX_ENTRY_CHARS.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}

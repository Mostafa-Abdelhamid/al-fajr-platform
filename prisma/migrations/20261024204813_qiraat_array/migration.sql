-- Convert "qiraat" from a single TEXT value to TEXT[] (a teacher can now
-- teach more than one riwaya). Existing values are preserved by wrapping
-- each one in a single-element array instead of dropping the column.
ALTER TABLE "TeacherProfile" ALTER COLUMN "qiraat" DROP DEFAULT;
ALTER TABLE "TeacherProfile" ALTER COLUMN "qiraat" TYPE TEXT[] USING ARRAY["qiraat"]::TEXT[];
ALTER TABLE "TeacherProfile" ALTER COLUMN "qiraat" SET DEFAULT ARRAY['حفص عن عاصم']::TEXT[];

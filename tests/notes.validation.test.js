const {
  validateCreateNotePayload,
  validateUpdateNotePayload,
  validateListNotesQuery,
  validateNoteIdParam,
} = require("../src/modules/notes/notes.validation");

describe("Notes Validation", () => {
  test("validateCreateNotePayload should pass valid payload", () => {
    const result = validateCreateNotePayload({
      title: "My note",
      content: "content",
      noteDate: "2026-04-19",
      entryType: "note",
      color: "green",
      time: "09:30",
      isStarred: false,
      location: "All Docs",
    });

    expect(result.isValid).toBe(true);
    expect(result.data.noteDate).toBeInstanceOf(Date);
    expect(result.data.entryType).toBe("note");
  });

  test("validateCreateNotePayload should fail invalid date", () => {
    const result = validateCreateNotePayload({
      title: "My note",
      content: "content",
      noteDate: "19-04-2026",
    });

    expect(result.isValid).toBe(false);
  });

  test("validateUpdateNotePayload should fail empty payload", () => {
    const result = validateUpdateNotePayload({});

    expect(result.isValid).toBe(false);
  });

  test("validateCreateNotePayload should fail invalid entryType", () => {
    const result = validateCreateNotePayload({
      title: "My note",
      content: "content",
      noteDate: "2026-04-19",
      entryType: "invalid-type",
    });

    expect(result.isValid).toBe(false);
  });

  test("validateListNotesQuery should parse query", () => {
    const query = validateListNotesQuery({
      page: "2",
      limit: "5",
      date: "2026-04-19",
      search: "proposal",
      entryType: "document",
      isStarred: "true",
      sort: "updatedAtDesc",
    });

    expect(query.page).toBe(2);
    expect(query.limit).toBe(5);
    expect(query.date).toBeInstanceOf(Date);
    expect(query.search).toBe("proposal");
    expect(query.entryType).toBe("document");
    expect(query.isStarred).toBe(true);
  });

  test("validateNoteIdParam should parse integer", () => {
    expect(validateNoteIdParam("10")).toBe(10);
  });
});

jest.mock("../src/config/db", () => ({
  prisma: {
    note: {
      create: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

const { prisma } = require("../src/config/db");
const {
  createNote,
  listNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../src/modules/notes/notes.service");

describe("Notes Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createNote should create note", async () => {
    prisma.note.create.mockResolvedValueOnce({ id: 1, title: "A" });

    const result = await createNote(1, {
      title: "A",
      content: "B",
      noteDate: new Date("2026-04-19T00:00:00.000Z"),
    });

    expect(prisma.note.create).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  test("createNote should throw 401 when token userId no longer exists", async () => {
    prisma.note.create.mockRejectedValueOnce({
      code: "P2003",
      meta: {
        field_name: "notes_userId_fkey (index)",
      },
    });

    await expect(
      createNote(999999, {
        title: "A",
        content: "B",
        noteDate: new Date("2026-04-19T00:00:00.000Z"),
        entryType: "note",
        label: "Kerja",
        color: "green",
        time: "09:00",
        isStarred: false,
        location: "All Docs",
      }),
    ).rejects.toMatchObject({
      name: "AppError",
      statusCode: 401,
      message: "Invalid token",
    });
  });

  test("listNotes should return paginated result", async () => {
    prisma.$transaction.mockResolvedValueOnce([
      2,
      [{ id: 1, title: "First" }, { id: 2, title: "Second" }],
    ]);

    const result = await listNotes(1, { page: 1, limit: 10, date: null });

    expect(result.pagination.total).toBe(2);
    expect(result.items.length).toBe(2);
  });

  test("listNotes should include search and metadata filters", async () => {
    prisma.$transaction.mockResolvedValueOnce([0, []]);

    await listNotes(1, {
      page: 1,
      limit: 10,
      date: null,
      startDate: new Date("2026-04-01T00:00:00.000Z"),
      endDate: new Date("2026-04-30T00:00:00.000Z"),
      search: "proposal",
      entryType: "document",
      isStarred: true,
      sort: "updatedAtDesc",
    });

    expect(prisma.note.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 1,
          entryType: "document",
          isStarred: true,
        }),
      }),
    );
  });

  test("getNoteById should throw if note not found", async () => {
    prisma.note.findFirst.mockResolvedValueOnce(null);

    await expect(getNoteById(1, 999)).rejects.toThrow("Note not found");
  });

  test("updateNote should update note after ownership check", async () => {
    prisma.note.findFirst.mockResolvedValueOnce({ id: 1, userId: 1 });
    prisma.note.update.mockResolvedValueOnce({ id: 1, title: "Updated" });

    const result = await updateNote(1, 1, { title: "Updated" });

    expect(result.title).toBe("Updated");
  });

  test("deleteNote should delete note", async () => {
    prisma.note.findFirst.mockResolvedValueOnce({ id: 1, userId: 1 });
    prisma.note.delete.mockResolvedValueOnce({ id: 1 });

    await deleteNote(1, 1);

    expect(prisma.note.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});

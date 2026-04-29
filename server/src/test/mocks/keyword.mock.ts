export const MockKeywordService = {
  addInfo: jest.fn().mockResolvedValue(undefined),
  addRawKeywords: jest.fn().mockResolvedValue(undefined),
  search: jest.fn().mockResolvedValue([]),
  getKeywords: jest.fn().mockResolvedValue(null),
};
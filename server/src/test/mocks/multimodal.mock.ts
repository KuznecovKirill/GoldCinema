export const MockMultimodalService = {
  analyzeMediaImages: jest.fn().mockResolvedValue(undefined),
  searchMedia: jest.fn().mockResolvedValue([{ id_media: 1, score: 0.9, title: 'Звёздные Воины' }]),
  askImage: jest.fn().mockResolvedValue(''),
};
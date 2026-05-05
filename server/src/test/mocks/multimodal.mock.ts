export const MockMultimodalService = {
  analyzeMediaImages: jest.fn().mockResolvedValue(undefined),
  searchMedia: jest.fn().mockResolvedValue([{ id_media: 300, score: 0.9, title: 'Матрица' }]),
  askImage: jest.fn().mockResolvedValue(''),
};
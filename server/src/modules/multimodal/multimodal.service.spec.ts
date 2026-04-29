import { Test, TestingModule } from '@nestjs/testing';
import { MultimodalService } from './multimodal.service';
import { ConfigService } from '@nestjs/config';
import { MockDrizzleService } from '../../test/mocks/drizzle.mock';
import { MockKeywordService } from '../../test/mocks/keyword.mock';

import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MultimodalService', () => {
  let service: MultimodalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MultimodalService,
        ConfigService,
        MockDrizzleService,
        // MockKeywordService,
      ],
    }).compile();

    service = module.get<MultimodalService>(MultimodalService);
  });

  it('should search media via LLM', async () => {
    const mockItems = [
      { id_media: 1, title: 'Интерстеллар', description: 'Действие происходит в недалёком будущем (2067 год), где Земля страдает от засухи, пыльных бурь и продовольственного кризиса. Единственная жизнеспособная сельхозкультура — кукуруза', keywords: 'космос' },
      { id_media: 2, title: 'Фильм', description: 'про комедию и смех', keywords: 'комедия, веселье' },
    ];
    jest.spyOn(service['db'], 'select').mockReturnValue({
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue(mockItems),
    } as any);
    jest.spyOn(service['db'], 'select').mockReturnValueOnce({
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([{ keywords: 'space' }]),
    } as any);

    mockedAxios.post.mockResolvedValueOnce({
      data: { response: '[{"id_media":1,"score":0.9}]' },
    });

    const result = await service.searchMedia('космос будущее Земля');
    expect(result).toHaveLength(1);
    expect(result[0].id_media).toBe(1);
  });
});
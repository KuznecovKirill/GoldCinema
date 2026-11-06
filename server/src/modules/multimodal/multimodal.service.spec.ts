import { Test, TestingModule } from '@nestjs/testing';
import { MultimodalService } from './multimodal.service';
import { ConfigService } from '@nestjs/config';
import { DrizzleService } from '@/database/drizzle.service';
import { KeywordService } from '@/modules/keyword/keyword.service';
import { MockDrizzleService } from '@/test/mocks/drizzle.mock';
import { MockKeywordService } from '@/test/mocks/keyword.mock';

import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MultimodalService', () => {
  let service: MultimodalService;

  beforeEach(async () => {
    // Создаем объект-заглушку для базы данных
    const mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MultimodalService,
        ConfigService,
        {
          provide: DrizzleService,
          useValue: { db: mockDb }, 
        },
        
        {
          provide: KeywordService,
          useValue: MockKeywordService,
        },
      ],
    }).compile();

    service = module.get<MultimodalService>(MultimodalService);
  });

  it('should search media via LLM', async () => {
    const mockItems = [
      { 
        id_media: 1, 
        title: 'Интерстеллар', 
        description: 'Действие происходит в недалёком будущем...', 
        keywords: 'космос' 
      }
    ];

    const keywordRow = [{ keywords: 'space' }];

    // Мокаем цепочку вызовов Drizzle ORM
    const selectMock = jest.fn();
    // 1-й вызов: db.select().from(mediaTable) -> возвращает массив медиа
    selectMock.mockReturnValueOnce({
      from: jest.fn().mockResolvedValue(mockItems),
    } as any);
    // 2-й вызов: db.select().from(keywordTable).where(...).limit(1)
    selectMock.mockReturnValue({
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(keywordRow),
    } as any);

    jest.spyOn(service['db'], 'select').mockImplementation(selectMock as any);

    // Мокаем ответ от Ollama
    mockedAxios.post.mockResolvedValueOnce({
      data: { response: '[{"id_media":1,"score":0.9}]' },
    });

    const result = await service.searchMedia('космос будущее Земля');
    
    expect(result).toHaveLength(1);
    expect(result[0].id_media).toBe(1);
  });
});
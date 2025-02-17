# from natasha import MorphVocab, Doc, Segmenter, NewsEmbedding, NewsMorphTagger

# import sys
# import json

# morph_vocab = MorphVocab()
# segmenter = Segmenter()
# emb = NewsEmbedding()
# morph_tagger = NewsMorphTagger(emb)


# def lemmatize_text(text):
#     doc = Doc(text)
#     doc.segment(segmenter)
#     doc.tag_morph(morph_tagger) # Добавляем определение morph признаков
#     for token in doc.tokens:
#         token.lemmatize(morph_vocab)
#     return [token.lemma for token in doc.tokens]


# if __name__ == "__main__":
#     text = sys.argv[1]
#     lemmas = lemmatize_text(text)
#     print(json.dumps(lemmas, ensure_ascii=False))
# coding: utf-8
from natasha import MorphVocab, Doc, Segmenter, NewsEmbedding, NewsMorphTagger
import sys
import json

morph_vocab = MorphVocab()
segmenter = Segmenter()
emb = NewsEmbedding()
morph_tagger = NewsMorphTagger(emb)

def lemmatize_text(text):
    doc = Doc(text)
    doc.segment(segmenter)
    doc.tag_morph(morph_tagger)  # Добавляем определение morph признаков
    for token in doc.tokens:
        token.lemmatize(morph_vocab)
    return [token.lemma for token in doc.tokens]

if __name__ == "__main__":
    # Устанавливаем кодировку для ввода и вывода
    sys.stdout.reconfigure(encoding='utf-8')
    
    text = sys.argv[1]
    lemmas = lemmatize_text(text)
    print(json.dumps(lemmas, ensure_ascii=False))


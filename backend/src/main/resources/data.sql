-- Inserir produtos apenas se a tabela estiver vazia
INSERT INTO produtos (nome, descricao, preco, categoria, imagem_url, disponivel, estoque, tempo_preparo, created_at, updated_at)
SELECT * FROM (VALUES
  ('Café Tradicional', 'Café coado fresquinho, encorpado e aromático. Feito com grãos selecionados do sul de Minas.', 6.00, 'CAFE', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop&q=90', true, 100, 3, NOW(), NOW()),
  ('Cappuccino Clássico', 'Espresso cremoso coberto com leite vaporizado e espuma sedosa. Polvilhado com chocolate em pó.', 12.00, 'CAFE', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&h=600&fit=crop&q=90', true, 80, 5, NOW(), NOW()),
  ('Café Gourmet Especial', 'Blend exclusivo de grãos arábica 100%, com notas de caramelo, frutas vermelhas e chocolate amargo.', 16.00, 'ESPECIAL', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&q=90', true, 50, 5, NOW(), NOW()),
  ('Espresso Intenso', 'Dose dupla de espresso com crema perfeita. Para quem aprecia um café forte e marcante.', 9.00, 'CAFE', 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800&h=600&fit=crop&q=90', true, 100, 2, NOW(), NOW()),
  ('Latte Art', 'Espresso com leite vaporizado cremoso e arte no topo. Suave e elegante.', 14.00, 'CAFE', 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=800&h=600&fit=crop&q=90', true, 60, 6, NOW(), NOW()),
  ('Cold Brew Premium', 'Café extraído a frio por 24 horas. Suave, encorpado e naturalmente adocicado. Servido com gelo.', 15.00, 'BEBIDA', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop&q=90', true, 40, 2, NOW(), NOW()),
  ('Chocolate Quente', 'Chocolate belga derretido com leite integral cremoso. Puro conforto em uma xícara.', 13.00, 'BEBIDA', 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=800&h=600&fit=crop&q=90', true, 50, 5, NOW(), NOW()),
  ('Croissant de Manteiga', 'Croissant folhado artesanal, crocante por fora e macio por dentro. Feito fresquinho todo dia.', 11.00, 'SALGADO', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop&q=90', true, 30, 3, NOW(), NOW()),
  ('Bolo de Cenoura com Chocolate', 'Bolo de cenoura fofinho coberto com ganache de chocolate meio amargo. Receita da vovó.', 10.00, 'DOCE', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&h=600&fit=crop&q=90', true, 20, 2, NOW(), NOW()),
  ('Cheesecake de Frutas Vermelhas', 'Cheesecake cremoso com base de biscoito e calda de frutas vermelhas frescas.', 18.00, 'DOCE', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop&q=90', true, 15, 2, NOW(), NOW()),
  ('Pão de Queijo Artesanal', 'Pão de queijo mineiro sequinho por fora e cremoso por dentro. Serve 3 unidades.', 9.00, 'SALGADO', 'https://images.unsplash.com/photo-1598214886806-c1d3f50bc4dc?w=800&h=600&fit=crop&q=90', true, 60, 8, NOW(), NOW()),
  ('Macchiato Caramelo', 'Espresso com espuma de leite e calda de caramelo artesanal. Doce e sofisticado.', 15.00, 'ESPECIAL', 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=800&h=600&fit=crop&q=90', true, 45, 5, NOW(), NOW())
) AS novos(nome, descricao, preco, categoria, imagem_url, disponivel, estoque, tempo_preparo, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM produtos LIMIT 1);

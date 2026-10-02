# Prepara as imagens do mapa para o jogo: recorta sprite sheets, tira o fundo magenta/preto,
# escala para 2 px por pixel do mundo, calcula a âncora de cada uma e torna as texturas emendáveis.
# Uso: python3 preparar.py   (lê originais/, grava ../img/ e ../src/js/44-imagens-prontas.js)
import json, os
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageEnhance

AQUI = os.path.dirname(os.path.abspath(__file__))
ORIG = os.path.join(AQUI, 'originais')
OUT = os.path.join(AQUI, '..', 'img')
JS = os.path.join(AQUI, '..', 'src', 'js', '44-imagens-prontas.js')
os.makedirs(OUT, exist_ok=True)
META = {}

def abrir(nome):
    return Image.open(os.path.join(ORIG, nome + '.webp'))

def salvar(im, slug, **meta):
    im.save(os.path.join(OUT, slug + '.webp'), 'WEBP', quality=88, method=6)
    META[slug] = dict(src='img/' + slug + '.webp', w=im.size[0], h=im.size[1], **meta)

def bbox_alpha(im, lim=24):
    return im.getchannel('A').point(lambda v: 255 if v > lim else 0).getbbox()

def sem_fundo(im, cor, tol=95, faixa=60):
    """Tira um fundo liso (ligado à borda) e suaviza a franja tirando a cor do fundo."""
    im = im.convert('RGB'); w, h = im.size
    br, bg_, bb = cor
    dist = Image.merge('RGB', [c.point(lambda v, b=b: abs(v - b)) for c, b in zip(im.split(), cor)])
    r, g, b = dist.split()
    soma = ImageChops.add(ImageChops.add(r.point(lambda v: v // 3), g.point(lambda v: v // 3)), b.point(lambda v: v // 3))
    perto = soma.point(lambda v: 0 if v < tol // 3 else 255)            # 0 = parecido com o fundo
    marca = perto.copy()
    for x in range(0, w, 16):
        for y in (0, h - 1):
            if marca.getpixel((x, y)) == 0: ImageDraw.floodfill(marca, (x, y), 128)
    for y in range(0, h, 16):
        for x in (0, w - 1):
            if marca.getpixel((x, y)) == 0: ImageDraw.floodfill(marca, (x, y), 128)
    fundo = marca.point(lambda v: 255 if v == 128 else 0)
    borda = fundo.filter(ImageFilter.MaxFilter(5))                       # faixa em volta do fundo
    # alfa na franja: proporcional à distância da cor do fundo
    a_franja = soma.point(lambda v: max(0, min(255, int((v * 3 - tol * .6) / faixa * 255))))
    alfa = Image.new('L', (w, h), 255)
    alfa.paste(a_franja, mask=borda)
    alfa.paste(0, mask=fundo)
    alfa.paste(0, mask=soma.point(lambda v: 255 if v < tol // 6 else 0))   # buracos internos (entre colunas, vidro)
    # tira a mistura com a cor do fundo (despill) onde é parcial
    px = im.load(); pa = alfa.load()
    for y in range(h):
        for x in range(w):
            a = pa[x, y]
            if 0 < a < 250:
                k = a / 255.0
                c = px[x, y]
                px[x, y] = tuple(max(0, min(255, int((c[i] - (1 - k) * cor[i]) / k))) for i in range(3))
    # sombra e vidro sobre o magenta (magenta escurecido ou misturado): vira sombra/vidro neutro com transparência
    if cor[1] < 100:
        for y in range(h):
            for x in range(w):
                a = pa[x, y]
                if a == 0: continue
                c = px[x, y]
                if c[1] < 70 and abs(c[0] - c[2]) < 70 and min(c[0], c[2]) - c[1] > 40:
                    luz = (c[0] + c[2]) / 2 / 252.0                 # quanto do magenta passou
                    s = max(0.0, 1 - luz)
                    pa[x, y] = int(min(a, 255 * min(1, s * .85 + .05)))
                    px[x, y] = (int(c[1] * .6), int(c[1] * .6), int(c[1] * .7))
    # franja de 3 px em volta do transparente: tira o tom do fundo (despill)
    perto_transp = alfa.point(lambda v: 255 if v < 200 else 0).filter(ImageFilter.MaxFilter(7))
    pp = perto_transp.load()
    for y in range(h):
        for x in range(w):
            if pp[x, y] and pa[x, y] > 0:
                c = list(px[x, y])
                if cor[1] < 100:          # fundo magenta: verde baixo, vermelho e azul altos
                    m = min(c[0], c[2]) - c[1]
                    if m > 0: c[0] -= int(m * .8); c[2] -= int(m * .8)
                px[x, y] = tuple(max(0, v) for v in c)
    im.putalpha(alfa)
    return im

def maior_bloco(im):
    """Fica só com o objeto principal da célula (tira pedaços dos vizinhos que invadiram)."""
    a = im.getchannel('A'); W, H = im.size; f = 4
    m = a.resize((max(1, W // f), max(1, H // f))).point(lambda v: 255 if v > 60 else 0)
    w, h = m.size; vis = m.copy(); blocos = []; cor = 1
    for y in range(h):
        for x in range(w):
            if vis.getpixel((x, y)) == 255:
                ImageDraw.floodfill(vis, (x, y), cor)
                bb = vis.point(lambda v, c=cor: 255 if v == c else 0).getbbox()
                n = sum(1 for v in vis.point(lambda v, c=cor: 1 if v == c else 0).getdata() if v)
                blocos.append((n, bb)); cor += 1
                if cor > 250: break
    if not blocos: return im
    blocos.sort(key=lambda b: -b[0]); n0, bb0 = blocos[0]
    x0, y0, x1, y1 = bb0; mx, my = (x1 - x0) * .04, (y1 - y0) * .04
    manter = [bb0] + [bb for n, bb in blocos[1:] if bb[0] < x1 + mx and bb[2] > x0 - mx and bb[1] < y1 + my and bb[3] > y0 - my]
    X0 = min(b[0] for b in manter) * f; Y0 = min(b[1] for b in manter) * f; X1 = max(b[2] for b in manter) * f + f; Y1 = max(b[3] for b in manter) * f + f
    out = Image.new('RGBA', im.size, (0, 0, 0, 0)); out.paste(im.crop((X0, Y0, X1, Y1)), (X0, Y0)); return out

def escalar(im, larg_mundo):
    """Recorta e escala para 2 px por pixel do mundo, com a largura dada em px do mundo."""
    bb = bbox_alpha(im); im = im.crop(bb)
    k = (larg_mundo * 2) / im.size[0]
    im = im.resize((max(1, round(im.size[0] * k)), max(1, round(im.size[1] * k))), Image.LANCZOS)
    return im

def lote(im, w, h, lift=0.0):
    """Peça que ocupa um lote w×h: a largura da imagem é a largura do lote. Âncora = canto de cima do lote."""
    W, H = im.size; s = W / ((w + h) * 64)              # px da imagem por px do mundo ×2
    ax = h * 64 * s; ay = H - lift * H - (w + h) * 32 * s
    return dict(ax=round(ax, 1), ay=round(ay, 1), lw=w, lh=h)

def objeto(im, w=1, h=1, lift=0.02):
    """Objeto apoiado no centro do lote: base = meio de baixo da imagem."""
    W, H = im.size; bx = W / 2; by = H - lift * H
    return dict(ax=round(bx - (w - h) * 32, 1), ay=round(by - (w + h) * 16, 1), lw=w, lh=h)

def grade(im, cols, rows):
    W, H = im.size; out = []
    for r in range(rows):
        for c in range(cols):
            cel = im.crop((c * W // cols, r * H // rows, (c + 1) * W // cols, (r + 1) * H // rows))
            out.append(cel)
    return out

# ---- serra, arco, túnel, pedras no mar (já vieram com fundo transparente) ----
for slug, w, h, larg in [('serra-pico-1', 8, 8, 0), ('serra-pico-2', 8, 8, 0), ('serra-pico-3', 7, 7, 0), ('serra-pico-4', 7, 7, 0),
                         ('serra-rocha-1', 5, 5, 0), ('serra-rocha-2', 5, 5, 0)]:
    im = escalar(abrir(slug).convert('RGBA'), (w + h) * 32)
    salvar(im, slug, **lote(im, w, h, .01))
for slug in ['serra-cordilheira-1', 'serra-cordilheira-2']:
    im = escalar(abrir(slug).convert('RGBA'), (14 + 6) * 32)
    salvar(im, slug, **lote(im, 14, 6, .01))
im = escalar(abrir('arco-do-deserto').convert('RGBA'), (4 + 3) * 32); salvar(im, 'arco-do-deserto', **lote(im, 4, 3, .01))
im = escalar(abrir('portal-tunel').convert('RGBA'), (3 + 3) * 32); salvar(im, 'portal-tunel', **lote(im, 3, 3, .01))
for slug in ['pedra-no-mar-1', 'pedra-no-mar-2']:
    im = escalar(abrir(slug).convert('RGBA'), 2 * 64); salvar(im, slug, **lote(im, 2, 2, .02))

# ---- neblina: a de fundo preto vira branca com alfa pelo brilho; as outras já têm alfa ----
im = abrir('neblina-1-preto').convert('RGB'); r, g, b = im.split()
alfa = ImageChops.lighter(ImageChops.lighter(r, g), b)
cor = Image.merge('RGB', [Image.eval(c, lambda v: v) for c in (r, g, b)])
px = cor.load(); pa = alfa.load(); w0, h0 = im.size
for y in range(h0):
    for x in range(w0):
        a = pa[x, y]
        if a > 3: c = px[x, y]; px[x, y] = tuple(min(255, int(v * 255 / a)) for v in c)
cor.putalpha(alfa)
salvar(escalar(cor, 240), 'neblina-1')
salvar(escalar(abrir('neblina-2').convert('RGBA'), 240), 'neblina-2')

# ---- sprite sheet de árvores e pedras (4×3, fundo magenta) ----
MAG = (252, 8, 252)
folha = sem_fundo(abrir('sprites-arvores-pedras'), MAG)
nomes = [('obstaculo-pinheiro-1', 30), ('obstaculo-pinheiro-2', 26), ('obstaculo-pinheiro-3', 40), ('obstaculo-arvore-grande-1', 46),
         ('obstaculo-arvore-grande-2', 44), ('obstaculo-arvore-grande-3', 52), ('obstaculo-pedra-grande-1', 34), ('obstaculo-pedra-grande-2', 40),
         ('obstaculo-arbusto-1', 30), ('obstaculo-arbusto-2', 30), ('obstaculo-cacto-1', 18), ('obstaculo-cacto-2', 26)]
for (slug, larg), cel in zip(nomes, grade(folha, 4, 3)):
    im = escalar(maior_bloco(cel), larg); salvar(im, slug, **objeto(im, lift=.03))

# ---- sprite sheet de decoração (4×4) ----
folha = sem_fundo(abrir('sprites-decoracao'), MAG)
nomes = [('banco-de-praca', 20, 1, 1), ('hidrante', 9, 1, 1), ('poste-de-luz', 10, 1, 1), ('lixeira', 10, 1, 1),
         ('canteiro-de-flores', 46, 1, 1), ('arvore-de-rua', 34, 1, 1), ('ipe-amarelo', 42, 1, 1), ('chafariz', 96, 2, 2),
         ('estatua', 34, 1, 1), ('coreto', 104, 2, 2), ('ponto-de-onibus', 48, 1, 1), ('caixa-de-correio', 10, 1, 1),
         ('vaso-de-plantas', 18, 1, 1), ('placa-de-direcao', 16, 1, 1), ('cerca-viva', 50, 1, 1), ('relogio-de-praca', 12, 1, 1)]
for (slug, larg, w, h), cel in zip(nomes, grade(folha, 4, 4)):
    im = escalar(maior_bloco(cel), larg); salvar(im, slug, **objeto(im, w, h, lift=.03))

# ---- carros (5×2): em cima a frente, embaixo a traseira ----
folha = sem_fundo(abrir('sprites-carros'), MAG)
ids = [('hatch', 21), ('seda', 23), ('taxi', 23), ('picape', 25), ('onibus', 38)]
cels = grade(folha, 5, 2)
for i, (cid, larg) in enumerate(ids):
    for lado, cel in (('frente', cels[i]), ('traseira', cels[5 + i])):
        im = escalar(maior_bloco(cel), larg); W, H = im.size
        salvar(im, 'carro-' + cid + '-' + lado, ax=round(W / 2, 1), ay=round(H - 12, 1))

# ---- ruas: 5 peças vistas de cima, cada uma ajustada para o mesmo quadrado e a mesma calçada ----
S = .22; Q = 512
folha = sem_fundo(abrir('ruas-versao-3'), MAG, tol=110)
def pecas(f):
    a = f.getchannel('A'); W, H = f.size; cols = []
    for x in range(W):
        cols.append(any(a.getpixel((x, y)) > 128 for y in range(0, H, 4)))
    out = []; x = 0
    while x < W:
        if cols[x]:
            x0 = x
            while x < W and cols[x]: x += 1
            if x - x0 > 40:
                p = f.crop((x0, 0, x, H)); p = p.crop(bbox_alpha(p, 128)); p = p.crop((4, 4, p.size[0] - 4, p.size[1] - 4))
                fundo = Image.new('RGBA', p.size, (200, 192, 176, 255)); fundo.alpha_composite(p); out.append(fundo)
        x += 1
    return out
def asfalto(p):
    r, g, b, a = p
    return a > 200 and max(r, g, b) < 115 and max(r, g, b) - min(r, g, b) < 25
def faixa(im, horiz, pos):
    """Onde começa e termina o asfalto numa linha (horiz) ou coluna, na posição relativa pos."""
    W, H = im.size; px = im.load()
    if horiz:
        y = int(pos * (H - 1)); xs = [x for x in range(W) if asfalto(px[x, y])]
        return (min(xs) / W, (max(xs) + 1) / W) if xs else None
    x = int(pos * (W - 1)); ys = [y for y in range(H) if asfalto(px[x, y])]
    return (min(ys) / H, (max(ys) + 1) / H) if ys else None
def remap(im, eixo_x, f):
    """Estica em 3 faixas para o asfalto ficar entre S e 1-S."""
    W, H = im.size
    if not f: return im.resize((Q, H) if eixo_x else (W, Q), Image.LANCZOS)
    a0, a1 = f; cortes = [0, a0, a1, 1]; alvo = [0, S, 1 - S, 1]; partes = []
    for i in range(3):
        if eixo_x: p = im.crop((round(cortes[i] * W), 0, max(round(cortes[i] * W) + 1, round(cortes[i + 1] * W)), H)).resize((max(1, round((alvo[i + 1] - alvo[i]) * Q)), H), Image.LANCZOS)
        else: p = im.crop((0, round(cortes[i] * H), W, max(round(cortes[i] * H) + 1, round(cortes[i + 1] * H)))).resize((W, max(1, round((alvo[i + 1] - alvo[i]) * Q))), Image.LANCZOS)
        partes.append(p)
    tot = sum(p.size[0] if eixo_x else p.size[1] for p in partes)
    out = Image.new('RGBA', (tot, H) if eixo_x else (W, tot)); o = 0
    for p in partes:
        out.paste(p, (o, 0) if eixo_x else (0, o)); o += p.size[0] if eixo_x else p.size[1]
    return out.resize((Q, H) if eixo_x else (W, Q), Image.LANCZOS)
# onde medir: (linha para o eixo x, coluna para o eixo y)
como = {'reta': (.5, None), 'curva': (.97, .97), 't': (.03, .97), 'cruz': (.03, .97), 'fim': (.97, None)}
for nome, p in zip(['reta', 'curva', 't', 'cruz', 'fim'], pecas(folha)):
    lx, cy = como[nome]
    fx = faixa(p, True, lx); im = remap(p, True, fx)
    fy = faixa(im, False, cy) if cy is not None else None; im = remap(im, False, fy)
    salvar(im.convert('RGB'), 'rua-' + nome, calcada=S)
    print('rua', nome, 'asfalto x', fx, 'y', fy)

# ---- texturas que se repetem: emenda suavizada (cruzamento com a cópia deslocada) ----
def emendavel(im, lado=512):
    im = im.convert('RGB'); W, H = im.size
    desl = ImageChops.offset(im, W // 2, H // 2)
    m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
    for i in range(64):            # máscara: 0 nas bordas, 255 no miolo
        v = int(255 * (i + 1) / 64); d.rectangle((W * i // 256, H * i // 256, W - 1 - W * i // 256, H - 1 - H * i // 256), fill=v)
    m = m.filter(ImageFilter.GaussianBlur(W / 40))
    return Image.composite(im, desl, m).resize((lado, lado), Image.LANCZOS)
for slug, brilho, cor_ in [('chao-grama', 1.28, .95), ('chao-areia-praia', 1.04, 1.0), ('chao-areia-deserto', 1.0, 1.0), ('chao-agua', 1.0, 1.0), ('paredao-rocha', 1.0, .9)]:
    im = emendavel(abrir(slug))
    im = ImageEnhance.Color(ImageEnhance.Brightness(im).enhance(brilho)).enhance(cor_)
    salvar(im, slug, textura=1)

with open(JS, 'w') as f:
    f.write('/* ================= Imagens prontas do mapa (geradas por imagens-mapa/preparar.py) =================\n'
            ' src = arquivo publicado junto com o jogo; ax/ay = âncora em px da imagem (2 px por px do mundo); lw/lh = lote. */\n')
    f.write('const IMG_PRONTAS=' + json.dumps(META, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(len(META), 'imagens;', sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT)) // 1024, 'KB')

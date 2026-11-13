document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carrossel').forEach(carrossel => {
        const container = carrossel.querySelector('.filmes, .posters');
        const esquerda = carrossel.querySelector('.esquerda');
        const direita = carrossel.querySelector('.direita');

        if (!container || !esquerda || !direita) return;

        const mover = direcao => {
            container.scrollBy({
                left: container.clientWidth * 0.75 * direcao,
                behavior: 'smooth'
            });
        };

        direita.addEventListener('click', () => mover(1));
        esquerda.addEventListener('click', () => mover(-1));

        container.addEventListener('keydown', event => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            mover(event.key === 'ArrowRight' ? 1 : -1);
        });

        let posicaoInicial = 0;
        let rolagemInicial = 0;
        let arrastando = false;

        container.addEventListener('pointerdown', event => {
            if (event.button !== 0 || event.target.closest('button')) return;
            posicaoInicial = event.clientX;
            rolagemInicial = container.scrollLeft;
            arrastando = true;
            container.classList.add('arrastando');
            container.setPointerCapture(event.pointerId);
        });

        container.addEventListener('pointermove', event => {
            if (!arrastando) return;
            container.scrollLeft = rolagemInicial - (event.clientX - posicaoInicial);
        });

        const pararArraste = () => {
            arrastando = false;
            container.classList.remove('arrastando');
        };

        container.addEventListener('pointerup', pararArraste);
        container.addEventListener('pointercancel', pararArraste);
        container.addEventListener('lostpointercapture', pararArraste);
    });

    document.querySelectorAll('.seguir-btn').forEach(botao => {
        botao.addEventListener('click', () => {
            const seguindo = botao.dataset.seguindo === 'true';
            botao.dataset.seguindo = String(!seguindo);
            botao.textContent = seguindo ? 'Seguir' : 'Seguindo';
            botao.setAttribute('aria-pressed', String(!seguindo));
        });
    });

    document.querySelectorAll('.filme').forEach(filme => {
        const estrelas = [...filme.querySelectorAll('[data-nota]')];
        estrelas.forEach((estrela, indice) => {
            estrela.addEventListener('click', () => {
                estrelas.forEach((item, itemIndice) => {
                    item.classList.toggle('selecionada', itemIndice <= indice);
                    item.setAttribute('aria-pressed', String(itemIndice <= indice));
                });
            });
        });

        const favorito = filme.querySelector('.favorito-btn');
        if (favorito) {
            favorito.addEventListener('click', () => {
                const ativo = favorito.getAttribute('aria-pressed') !== 'true';
                favorito.setAttribute('aria-pressed', String(ativo));
                favorito.textContent = ativo ? '♥ Favoritado' : '♡ Favoritar';
            });
        }
    });

    const busca = document.querySelector('#busca-filmes');
    if (busca) {
        const itens = [...document.querySelectorAll('.filme, .posters img')];
        const normalizar = texto => texto
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase('pt-BR');

        busca.addEventListener('input', () => {
            const termo = normalizar(busca.value.trim());
            itens.forEach(item => {
                const titulo = item.dataset.titulo || item.querySelector('h4')?.textContent || item.alt;
                item.hidden = !normalizar(titulo).includes(termo);
            });
        });
    }

    const notificacoesBotao = document.querySelector('.notificacoes-toggle');
    const painelNotificacoes = document.querySelector('.painel-notificacoes');
    if (notificacoesBotao && painelNotificacoes) {
        const fecharNotificacoes = () => {
            notificacoesBotao.setAttribute('aria-expanded', 'false');
            painelNotificacoes.hidden = true;
        };

        notificacoesBotao.addEventListener('click', () => {
            const abrir = notificacoesBotao.getAttribute('aria-expanded') !== 'true';
            notificacoesBotao.setAttribute('aria-expanded', String(abrir));
            painelNotificacoes.hidden = !abrir;
        });

        document.addEventListener('click', event => {
            if (!event.target.closest('.notificacoes')) fecharNotificacoes();
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') fecharNotificacoes();
        });
    }
});

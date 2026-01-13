/**
 * Matrix Rain Effect para tela de login
 * Implementação usando Canvas e jQuery
 */
class MatrixRain {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn(`Canvas com ID "${canvasId}" não encontrado`);
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    this.fontSize = 14;
    this.columns = 0;
    this.drops = [];
    this.animationId = null;
    
    this.init();
  }
  
  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = Array(this.columns).fill(1);
  }
  
  draw() {
    // Fundo semi-transparente para efeito de rastro
    this.ctx.fillStyle = 'rgba(24, 24, 27, 0.05)'; // zinc-950 com transparência
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Cor do texto (emerald-500)
    this.ctx.fillStyle = '#10b981'; // emerald-500
    this.ctx.font = `${this.fontSize}px monospace`;
    
    // Desenhar caracteres
    for (let i = 0; i < this.drops.length; i++) {
      const text = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;
      
      this.ctx.fillText(text, x, y);
      
      // Resetar drop quando atinge o final ou aleatoriamente
      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      
      this.drops[i]++;
    }
  }
  
  animate() {
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    // Limpar canvas
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

let matrixInstance = null;

/**
 * Inicializa o Matrix Rain no canvas especificado
 * @param {string} canvasId - ID do canvas
 */
export function initMatrixRain(canvasId = 'matrix-canvas') {
  // Destruir instância anterior se existir
  if (matrixInstance) {
    matrixInstance.destroy();
  }
  
  // Criar nova instância
  matrixInstance = new MatrixRain(canvasId);
  
  return matrixInstance;
}

/**
 * Destrói a instância do Matrix Rain
 */
export function destroyMatrixRain() {
  if (matrixInstance) {
    matrixInstance.destroy();
    matrixInstance = null;
  }
}

export default MatrixRain;


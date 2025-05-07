import { RolNumber } from "../../domain";

// Definir RolColors fuera del componente
export const RolColors: Record<number, {light: string, base: string, contrast: string}> = {
    1: {
      light: '--rol-1-light-color',
      base: '--rol-1-base-color',
      contrast: '--rol-1-contrast-color',
    },
    2: {
      light: '--rol-2-light-color',
      base: '--rol-2-base-color',
      contrast: '--rol-2-contrast-color',
    },
    3: {
      light: '--rol-3-light-color',
      base: '--rol-3-base-color',
      contrast: '--rol-3-contrast-color',
    },
    4: {
      light: '--rol-4-light-color',
      base: '--rol-4-base-color',
      contrast: '--rol-4-contrast-color',
    },
  };
  
    // Función para obtener el estilo del texto según el rol
    export const getRolTextStyle = (rol: RolNumber): React.CSSProperties => {
      return {
          color: `var(${RolColors[rol].contrast})`
      };
    };
    export const getRolColorCard = (rol: RolNumber): React.CSSProperties => {
      return {
        backgroundColor: `var(${RolColors[rol].light})`
      };
    };
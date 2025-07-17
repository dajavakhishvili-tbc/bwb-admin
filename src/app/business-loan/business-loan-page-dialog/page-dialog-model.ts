export interface PageConfig {
    id: string;
    title: string;
    description: string;
    posthogEvent: string;
    createdAt: Date;
  }
  
  export interface DialogForm {
    title: string;
    description: string;
    posthogEvent: string;
  }
  
  export type DialogType = 'add' | 'edit' | 'delete';
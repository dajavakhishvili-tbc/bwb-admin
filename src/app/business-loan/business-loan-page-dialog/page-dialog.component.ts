import { ChangeDetectionStrategy, Component, computed, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogForm, DialogType, PageConfig } from './page-dialog-model';

@Component({
  selector: 'ib-page-dialog',
  templateUrl: './page-dialog.component.html',
  styleUrl: './page-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class PageDialogComponent {
  dialogType = input<DialogType>('add');
  selectedPage = input<PageConfig | null>(null);
  dialogForm = input<DialogForm>({ title: '', description: '', posthogEvent: '' });
  isOpen = input<boolean>(false);

  close = output<void>();
  save = output<DialogForm>();
  delete = output<void>();
  formChange = output<DialogForm>();

  private readonly dialogTitleMap: Record<DialogType, string> = {
    add: 'Add New Page',
    edit: 'Edit Page',
    delete: 'Delete Page'
  };

  dialogTitle = computed(() => this.dialogTitleMap[this.dialogType()] ?? '');
  saveButtonText = computed(() => this.dialogType() === 'edit' ? 'Update Page' : 'Add Page');
  isDeleteDialog = computed(() => this.dialogType() === 'delete');
  selectedPageTitle = computed(() => this.selectedPage()?.title);
} 
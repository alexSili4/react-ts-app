interface IBaseProps {
  title: string;
  message: string;
  actionLabel: string;
}

// Дія — або посилання (404: на головну), або кнопка (ChunkErrorBoundary:
// перезавантажити). Обидва разом передати не можна.
interface ILinkActionProps extends IBaseProps {
  actionTo: string;
  onActionClick?: never;
}

interface IButtonActionProps extends IBaseProps {
  actionTo?: never;
  onActionClick: () => void;
}

export type IProps = ILinkActionProps | IButtonActionProps;

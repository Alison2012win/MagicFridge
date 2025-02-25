import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'

interface DeleteConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  itemName
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>确认删除</DialogTitle>
      <DialogContent>
        <DialogContentText>
          确定要删除 "{itemName}" 吗？此操作无法撤销。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          删除
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmDialog
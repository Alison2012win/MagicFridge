import React, { useState } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { Ingredient } from '../App'
import DeleteConfirmDialog from './DeleteConfirmDialog'

interface IngredientListProps {
  ingredients: Ingredient[]
  onEdit?: (ingredient: Ingredient) => void
  onDelete?: (ingredient: Ingredient) => void
}

const IngredientList: React.FC<IngredientListProps> = ({ ingredients, onEdit, onDelete }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingIngredient, setDeletingIngredient] = useState<Ingredient | null>(null)

  const handleDelete = (ingredient: Ingredient) => {
    setDeletingIngredient(ingredient)
    setDeleteDialogOpen(true)
  }

  const getDaysUntilExpiration = (expirationDate: string) => {
    const today = new Date()
    const expDate = new Date(expirationDate)
    const diffTime = expDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // 对食材进行排序
  const sortedIngredients = [...ingredients].sort((a, b) => {
    const daysLeftA = getDaysUntilExpiration(a.expirationDate)
    const daysLeftB = getDaysUntilExpiration(b.expirationDate)
    return daysLeftA - daysLeftB
  })

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>名称</TableCell>
              <TableCell>分类</TableCell>
              <TableCell>生产日期</TableCell>
              <TableCell>保质期状态</TableCell>
              <TableCell>数量</TableCell>
              {(onEdit || onDelete) && <TableCell>操作</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedIngredients.map((ingredient) => {
              const daysLeft = getDaysUntilExpiration(ingredient.expirationDate)
              const isExpired = daysLeft < 0

              return (
                <TableRow key={ingredient.id}>
                  <TableCell>{ingredient.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={ingredient.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{ingredient.productionDate}</TableCell>
                  <TableCell
                    sx={{
                      color: isExpired
                        ? 'error.main'
                        : daysLeft <= 7
                        ? 'warning.main'
                        : 'text.secondary',
                    }}
                  >
                    {isExpired
                      ? `已过期 ${Math.abs(daysLeft)} 天`
                      : `保质期还剩 ${daysLeft} 天`}
                  </TableCell>
                  <TableCell>{ingredient.quantity} {ingredient.unit}</TableCell>
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {onEdit && (
                          <IconButton
                            size="small"
                            onClick={() => onEdit(ingredient)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                        {onDelete && (
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(ingredient)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setDeletingIngredient(null)
        }}
        onConfirm={() => {
          if (deletingIngredient && onDelete) {
            onDelete(deletingIngredient)
            setDeleteDialogOpen(false)
            setDeletingIngredient(null)
          }
        }}
        itemName={deletingIngredient?.name || ''}
      />
    </>
  )
}

export default IngredientList
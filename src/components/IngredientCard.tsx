import React, { useState } from 'react'
import { Card, CardContent, CardMedia, Typography, Box, Chip, IconButton } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { Ingredient } from '../App'
import DeleteConfirmDialog from './DeleteConfirmDialog'

interface IngredientCardProps {
  ingredient: Ingredient
  onEdit?: (ingredient: Ingredient) => void
  onDelete?: (ingredient: Ingredient) => void
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient, onEdit, onDelete }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // 计算剩余保质期天数
  const getDaysUntilExpiration = () => {
    const today = new Date()
    const expirationDate = new Date(ingredient.expirationDate)
    const diffTime = expirationDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysLeft = getDaysUntilExpiration()
  const isExpired = daysLeft < 0

  return (
    <>
      <Card sx={{ width: 280, display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="140"
          image={ingredient.image || '/placeholder.png'}
          alt={ingredient.name}
        />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" component="div">
                {ingredient.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {onEdit && (
                  <IconButton
                    size="small"
                    onClick={() => onEdit(ingredient)}
                    sx={{ padding: 0.5 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
                {onDelete && (
                  <IconButton
                    size="small"
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{ padding: 0.5 }}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
            <Chip
              label={ingredient.category}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            生产日期：{ingredient.productionDate}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            数量：{ingredient.quantity} 个
          </Typography>
          <Typography
            variant="body2"
            color={isExpired ? 'error.main' : daysLeft <= 7 ? 'warning.main' : 'text.secondary'}
          >
            {isExpired
              ? `已过期 ${Math.abs(daysLeft)} 天`
              : `保质期还剩 ${daysLeft} 天`}
          </Typography>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          onDelete?.(ingredient)
          setDeleteDialogOpen(false)
        }}
        itemName={ingredient.name}
      />
    </>
  )
}

export default IngredientCard
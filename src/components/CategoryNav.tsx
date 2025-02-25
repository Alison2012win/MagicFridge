import React from 'react'
import { List, ListItem, ListItemButton, ListItemText, Paper, Badge } from '@mui/material'
import { Ingredient } from '../App'

interface CategoryNavProps {
  categories: string[]
  currentCategory: string
  onCategoryChange: (category: string) => void
  ingredients: Ingredient[]
}

const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  currentCategory,
  onCategoryChange,
  ingredients,
}) => {
  // 计算各分类的食材数量
  const getCategoryCount = (category: string) => {
    if (category === '全部') {
      return ingredients.length
    }
    if (category === '即将过期') {
      const today = new Date()
      const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
      return ingredients.filter(item => {
        const expirationDate = new Date(item.expirationDate)
        return expirationDate <= threeDaysFromNow
      }).length
    }
    return ingredients.filter(item => item.category === category).length
  }
  return (
    <Paper sx={{ width: 200, flexShrink: 0 }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={currentCategory === '全部'}
            onClick={() => onCategoryChange('全部')}
          >
            <ListItemText primary="全部" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={currentCategory === '即将过期'}
            onClick={() => onCategoryChange('即将过期')}
          >
            <ListItemText primary="即将过期" />
          </ListItemButton>
        </ListItem>
        {categories.map((category) => (
          <ListItem key={category} disablePadding>
            <ListItemButton
              selected={currentCategory === category}
              onClick={() => onCategoryChange(category)}
            >
              <ListItemText primary={category} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default CategoryNav
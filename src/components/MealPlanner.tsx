import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Paper,
  Grid
} from '@mui/material'
import { Ingredient } from '../App'

interface MealPlannerProps {
  open: boolean
  onClose: () => void
  ingredients: Ingredient[]
}

interface Recipe {
  name: string
  mainIngredients: {
    name: string
    amount: string
  }[]
  secondaryIngredients?: {
    name: string
    amount: string
  }[]
  seasonings?: {
    name: string
    amount: string
  }[]
}

interface Meal {
  name: string
  recipes: Recipe[]
}

interface DailyMealPlan {
  breakfast: Meal
  lunch: Meal
  dinner: Meal
}

const MealPlanner: React.FC<MealPlannerProps> = ({ open, onClose, ingredients }) => {
  // 添加状态来触发菜谱重新生成
  const [refreshKey, setRefreshKey] = useState(0)
  
  // 生成菜谱的函数
  const generateMealPlan = (): DailyMealPlan => {
    const breakfastOptions = [
      {
        name: '川式早餐',
        recipes: [
          {
            name: '担担面',
            mainIngredients: [
              { name: '面条', amount: '200g' },
              { name: '猪肉末', amount: '100g' }
            ],
            secondaryIngredients: [
              { name: '青菜', amount: '100g' },
              { name: '花生碎', amount: '30g' }
            ],
            seasonings: [
              { name: '花椒', amount: '5g' },
              { name: '辣椒油', amount: '15ml' },
              { name: '酱油', amount: '10ml' },
              { name: '盐', amount: '适量' }
            ]
          },
          {
            name: '煎蛋',
            mainIngredients: [
              { name: '鸡蛋', amount: '2个' }
            ],
            seasonings: [
              { name: '盐', amount: '适量' },
              { name: '胡椒粉', amount: '少许' }
            ]
          }
        ]
      },
      {
        name: '传统早点',
        recipes: [
          {
            name: '豆花饭',
            mainIngredients: [
              { name: '豆腐', amount: '300g' },
              { name: '米饭', amount: '200g' }
            ],
            secondaryIngredients: [
              { name: '青椒', amount: '50g' },
              { name: '葱花', amount: '20g' }
            ],
            seasonings: [
              { name: '辣椒油', amount: '15ml' },
              { name: '酱油', amount: '10ml' },
              { name: '盐', amount: '适量' }
            ]
          },
          {
            name: '油条豆浆',
            mainIngredients: [
              { name: '油条', amount: '2根' },
              { name: '豆浆', amount: '300ml' }
            ],
            seasonings: [
              { name: '白糖', amount: '适量' }
            ]
          }
        ]
      }
    ]
  
    const lunchOptions = [
      {
        name: '麻辣午餐',
        recipes: [
          {
            name: '麻婆豆腐',
            mainIngredients: [
              { name: '豆腐', amount: '400g' },
              { name: '猪肉末', amount: '150g' }
            ],
            secondaryIngredients: [
              { name: '葱花', amount: '30g' },
              { name: '蒜末', amount: '20g' }
            ],
            seasonings: [
              { name: '豆瓣酱', amount: '30g' },
              { name: '花椒', amount: '5g' },
              { name: '生抽', amount: '15ml' },
              { name: '盐', amount: '适量' }
            ]
          },
          {
            name: '回锅肉',
            mainIngredients: [
              { name: '五花肉', amount: '300g' },
              { name: '青椒', amount: '150g' }
            ],
            secondaryIngredients: [
              { name: '蒜苗', amount: '100g' },
              { name: '生姜', amount: '20g' }
            ],
            seasonings: [
              { name: '豆瓣酱', amount: '25g' },
              { name: '料酒', amount: '15ml' },
              { name: '生抽', amount: '20ml' },
              { name: '盐', amount: '适量' }
            ]
          }
        ]
      },
      {
        name: '川味午餐',
        recipes: [
          {
            name: '水煮鱼',
            mainIngredients: [
              { name: '鱼片', amount: '400g' }
            ],
            secondaryIngredients: [
              { name: '豆芽', amount: '200g' },
              { name: '青菜', amount: '150g' },
              { name: '葱段', amount: '50g' }
            ],
            seasonings: [
              { name: '花椒', amount: '10g' },
              { name: '干辣椒', amount: '20g' },
              { name: '料酒', amount: '20ml' },
              { name: '生抽', amount: '15ml' },
              { name: '盐', amount: '适量' }
            ]
          },
          {
            name: '宫保鸡丁',
            mainIngredients: [
              { name: '鸡胸肉', amount: '300g' },
              { name: '花生', amount: '50g' }
            ],
            secondaryIngredients: [
              { name: '胡萝卜', amount: '50g' },
              { name: '黄瓜', amount: '50g' },
              { name: '葱花', amount: '30g' }
            ],
            seasonings: [
              { name: '干辣椒', amount: '10g' },
              { name: '花椒', amount: '5g' },
              { name: '生抽', amount: '15ml' },
              { name: '醋', amount: '10ml' },
              { name: '盐', amount: '适量' }
            ]
          }
        ]
      }
    ]
  
    const dinnerOptions = [
      {
        name: '麻辣晚餐',
        recipes: [
          {
            name: '毛血旺',
            mainIngredients: [
              { name: '毛肚', amount: '200g' },
              { name: '猪血', amount: '200g' }
            ],
            secondaryIngredients: [
              { name: '豆芽', amount: '150g' },
              { name: '韭黄', amount: '100g' },
              { name: '葱段', amount: '50g' }
            ],
            seasonings: [
              { name: '花椒', amount: '10g' },
              { name: '干辣椒', amount: '20g' },
              { name: '豆瓣酱', amount: '30g' },
              { name: '料酒', amount: '20ml' },
              { name: '盐', amount: '适量' }
            ]
          },
          {
            name: '辣子鸡',
            mainIngredients: [
              { name: '鸡块', amount: '400g' }
            ],
            secondaryIngredients: [
              { name: '花生', amount: '50g' },
              { name: '葱段', amount: '30g' }
            ],
            seasonings: [
              { name: '干辣椒', amount: '30g' },
              { name: '花椒', amount: '15g' },
              { name: '生抽', amount: '20ml' },
              { name: '料酒', amount: '15ml' },
              { name: '盐', amount: '适量' }
            ]
          }
        ]
      }
    ]
  
    return {
      breakfast: breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)],
      lunch: lunchOptions[Math.floor(Math.random() * lunchOptions.length)],
      dinner: dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)]
    }
  }
  
  // 生成一日三餐的菜谱
  const mealPlan = useMemo<DailyMealPlan>(() => {
    return generateMealPlan()
  }, [refreshKey])
  
  // 处理换一换按钮点击
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }
  
  // 计算缺少的食材
  const missingIngredients = useMemo(() => {
    const required = new Map<string, { amount: number; unit: string }>()
    const available = new Map<string, { amount: number; unit: string }>()

    // 统计所需食材
    Object.values(mealPlan).forEach(meal => {
      meal.recipes.forEach(recipe => {
        // 处理主料
        recipe.mainIngredients.forEach(ingredient => {
          const match = ingredient.amount.match(/([\d.]+)\s*([^\d.]+)/)
          if (match) {
            const amount = parseFloat(match[1])
            const unit = match[2]
            const existing = required.get(ingredient.name) || { amount: 0, unit }
            required.set(ingredient.name, {
              amount: existing.amount + amount,
              unit: existing.unit
            })
          }
        })

        // 处理辅料
        if (recipe.secondaryIngredients) {
          recipe.secondaryIngredients.forEach(ingredient => {
            const match = ingredient.amount.match(/([\d.]+)\s*([^\d.]+)/)
            if (match) {
              const amount = parseFloat(match[1])
              const unit = match[2]
              const existing = required.get(ingredient.name) || { amount: 0, unit }
              required.set(ingredient.name, {
                amount: existing.amount + amount,
                unit: existing.unit
              })
            }
          })
        }

        // 处理调味料
        if (recipe.seasonings) {
          recipe.seasonings.forEach(ingredient => {
            const match = ingredient.amount.match(/([\d.]+)\s*([^\d.]+)/)
            if (match) {
              const amount = parseFloat(match[1])
              const unit = match[2]
              const existing = required.get(ingredient.name) || { amount: 0, unit }
              required.set(ingredient.name, {
                amount: existing.amount + amount,
                unit: existing.unit
              })
            }
          })
        }
      })
    })

    // 统计现有食材
    ingredients.forEach(ingredient => {
      available.set(ingredient.name, {
        amount: ingredient.quantity,
        unit: ingredient.unit
      })
    })

    // 计算缺少的食材
    const missing: { name: string; required: number; available: number; unit: string }[] = []
    required.forEach((requiredInfo, name) => {
      const availableInfo = available.get(name) || { amount: 0, unit: requiredInfo.unit }
      if (availableInfo.amount < requiredInfo.amount) {
        missing.push({
          name,
          required: requiredInfo.amount,
          available: availableInfo.amount,
          unit: requiredInfo.unit
        })
      }
    })

    return missing
  }, [ingredients, mealPlan])

  const renderMeal = (meal: Meal) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {meal.name}
      </Typography>
      <List>
        {meal.recipes.map((recipe, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={recipe.name}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      主料：{recipe.mainIngredients.map(ing => `${ing.name} ${ing.amount}`).join('、')}
                    </Typography>
                    {recipe.secondaryIngredients && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        辅料：{recipe.secondaryIngredients.map(ing => `${ing.name} ${ing.amount}`).join('、')}
                      </Typography>
                    )}
                    {recipe.seasonings && (
                      <Typography variant="body2" color="text.secondary">
                        调味料：{recipe.seasonings.map(ing => `${ing.name} ${ing.amount}`).join('、')}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
            {index < meal.recipes.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>今天吃什么</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">
                  一日三餐建议
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRefresh}
                >
                  换一换
                </Button>
              </Box>
              {renderMeal(mealPlan.breakfast)}
              {renderMeal(mealPlan.lunch)}
              {renderMeal(mealPlan.dinner)}
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                采购清单
              </Typography>
              <List>
                {missingIngredients.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={item.name}
                      secondary={`需要 ${item.required}${item.unit}，现有 ${item.available}${item.unit}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  )
}

export default MealPlanner
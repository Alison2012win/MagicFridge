import React, { useState } from 'react'
import { Box, Container, Typography, Button } from '@mui/material'
import CategoryNav from './components/CategoryNav'
import IngredientList from './components/IngredientList'
import IngredientForm from './components/IngredientForm'
import WhatToEatDialog from './components/MealPlanner'

// 定义食材类型
// 定义配料类型
export interface Ingredient {
  id: string
  category: string
  name: string
  image: string
  productionDate: string
  expirationDate: string
  quantity: number
  mainIngredients?: { name: string; amount: string }[]
  secondaryIngredients?: { name: string; amount: string }[]
  seasonings?: { name: string; amount: string }[]
}

// 定义分类
const categories = ['蔬菜', '水果', '肉类', '海鲜', '乳制品', '其他']

// 生成随机日期
const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0]
}

// 为每个分类生成示例数据
const generateInitialData = (): Ingredient[] => {
  const data: Ingredient[] = []
  const today = new Date()
  
  // 蔬菜
  const vegetables = ['胡萝卜', '西兰花', '生菜', '茄子', '青椒']
  vegetables.forEach((name, index) => {
    // 生菜和青椒已过期，其他正常
    const isExpired = name === '生菜' || name === '青椒'
    const productionDate = generateRandomDate(
      new Date(today.getTime() - (isExpired ? 14 : 7) * 24 * 60 * 60 * 1000),
      new Date(today.getTime() - (isExpired ? 7 : 3) * 24 * 60 * 60 * 1000)
    )
    const expirationDate = generateRandomDate(
      new Date(today.getTime() - (isExpired ? 2 : 0) * 24 * 60 * 60 * 1000),
      new Date(today.getTime() + (isExpired ? -1 : 14) * 24 * 60 * 60 * 1000)
    )
    data.push({
      id: `veg-${index}`,
      category: '蔬菜',
      name,
      image: `https://source.unsplash.com/featured/?vegetable,${name}`,
      productionDate,
      expirationDate,
      quantity: Math.floor(Math.random() * 3) + 1,
      unit: '个',
      mainIngredients: [{ name: name, amount: '500g' }],
      secondaryIngredients: [{ name: '葱', amount: '2根' }, { name: '蒜', amount: '2瓣' }],
      seasonings: [{ name: '盐', amount: '适量' }, { name: '胡椒粉', amount: '少许' }]
    })
  })

  // 水果
  const fruits = ['苹果', '香蕉', '橙子', '葡萄']
  fruits.forEach((name, index) => {
    // 香蕉即将过期，葡萄已过期
    const isExpired = name === '葡萄'
    const isNearExpiry = name === '香蕉'
    const productionDate = generateRandomDate(
      new Date(today.getTime() - (isExpired ? 10 : 7) * 24 * 60 * 60 * 1000),
      new Date(today.getTime() - (isExpired ? 5 : 3) * 24 * 60 * 60 * 1000)
    )
    const expirationDate = generateRandomDate(
      new Date(today.getTime() + (isExpired ? -2 : isNearExpiry ? 2 : 7) * 24 * 60 * 60 * 1000),
      new Date(today.getTime() + (isExpired ? -1 : isNearExpiry ? 4 : 14) * 24 * 60 * 60 * 1000)
    )
    const unit = name === '葡萄' ? '串' : '个'
    data.push({
      id: `fruit-${index}`,
      category: '水果',
      name,
      image: `https://source.unsplash.com/featured/?fruit,${name}`,
      productionDate,
      expirationDate,
      quantity: Math.floor(Math.random() * 5) + 1,
      unit
    })
  })

  // 肉类
  const meats = ['猪肉', '牛肉', '鸡肉', '羊肉']
  meats.forEach((name, index) => {
    const productionDate = generateRandomDate(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), today)
    const expirationDate = generateRandomDate(today, new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000))
    data.push({
      id: `meat-${index}`,
      category: '肉类',
      name,
      image: `https://source.unsplash.com/featured/?meat,${name}`,
      productionDate,
      expirationDate,
      quantity: 500,
      unit: 'g',
      mainIngredients: [{ name: name, amount: '300g' }],
      secondaryIngredients: [{ name: '姜', amount: '3片' }, { name: '蒜', amount: '3瓣' }],
      seasonings: [{ name: '生抽', amount: '2勺' }, { name: '料酒', amount: '1勺' }, { name: '盐', amount: '适量' }]
    })
  })

  // 海鲜
  const seafoods = ['三文鱼', '虾', '螃蟹', '鱿鱼']
  seafoods.forEach((name, index) => {
    const productionDate = generateRandomDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), today)
    const expirationDate = generateRandomDate(today, new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000))
    const unit = name === '虾' || name === '螃蟹' ? '只' : 'g'
    const quantity = unit === 'g' ? 300 : Math.floor(Math.random() * 10) + 5
    data.push({
      id: `seafood-${index}`,
      category: '海鲜',
      name,
      image: `https://source.unsplash.com/featured/?seafood,${name}`,
      productionDate,
      expirationDate,
      quantity,
      unit,
      mainIngredients: [{ name: name, amount: '250g' }],
      secondaryIngredients: [{ name: '葱', amount: '2根' }, { name: '姜', amount: '2片' }],
      seasonings: [{ name: '蒜蓉', amount: '2勺' }, { name: '料酒', amount: '1勺' }, { name: '盐', amount: '适量' }]
    })
  })

  // 乳制品
  const dairy = ['牛奶', '酸奶', '奶酪', '黄油']
  dairy.forEach((name, index) => {
    // 牛奶和酸奶即将过期
    const isNearExpiry = name === '牛奶' || name === '酸奶'
    const productionDate = generateRandomDate(
      new Date(today.getTime() - (isNearExpiry ? 15 : 10) * 24 * 60 * 60 * 1000),
      new Date(today.getTime() - (isNearExpiry ? 10 : 5) * 24 * 60 * 60 * 1000)
    )
    const expirationDate = generateRandomDate(
      new Date(today.getTime() + (isNearExpiry ? 2 : 10) * 24 * 60 * 60 * 1000),
      new Date(today.getTime() + (isNearExpiry ? 5 : 20) * 24 * 60 * 60 * 1000)
    )
    const unit = name === '牛奶' || name === '酸奶' ? 'ml' : 'g'
    const quantity = unit === 'ml' ? 500 : 200
    data.push({
      id: `dairy-${index}`,
      category: '乳制品',
      name,
      image: `https://source.unsplash.com/featured/?dairy,${name}`,
      productionDate,
      expirationDate,
      quantity,
      unit
    })
  })

  // 其他
  const others = ['面包', '饼干', '果酱', '蛋糕']
  others.forEach((name, index) => {
    // 面包和蛋糕已过期，饼干即将过期
    const isExpired = name === '面包' || name === '蛋糕'
    const isNearExpiry = name === '饼干'
    const productionDate = generateRandomDate(
      new Date(today.getTime() - (isExpired ? 10 : 5) * 24 * 60 * 60 * 1000),
      new Date(today.getTime() - (isExpired ? 5 : 2) * 24 * 60 * 60 * 1000)
    )
    const expirationDate = generateRandomDate(
      new Date(today.getTime() + (isExpired ? -3 : isNearExpiry ? 2 : 7) * 24 * 60 * 60 * 1000),
      new Date(today.getTime() + (isExpired ? -1 : isNearExpiry ? 4 : 10) * 24 * 60 * 60 * 1000)
    )
    const unit = name === '面包' ? '片' : name === '饼干' ? '包' : name === '果酱' ? 'g' : '个'
    const quantity = unit === 'g' ? 250 : Math.floor(Math.random() * 5) + 1
    data.push({
      id: `other-${index}`,
      category: '其他',
      name,
      image: `https://source.unsplash.com/featured/?food,${name}`,
      productionDate,
      expirationDate,
      quantity,
      unit
    })
  })

  return data
}

function App() {
  // 当前选中的分类
  const [currentCategory, setCurrentCategory] = useState('全部')
  // 食材列表
  const [ingredients, setIngredients] = useState<Ingredient[]>(generateInitialData())
  
  // 添加食材表单的显示状态
  const [formOpen, setFormOpen] = useState(false)
  // 当前编辑的食材
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | undefined>()
  // 今天吃什么对话框的显示状态
  const [whatToEatOpen, setWhatToEatOpen] = useState(false)
  
  // 处理添加或编辑食材
  const handleSubmit = (ingredient: Omit<Ingredient, 'id'>) => {
    if (editingIngredient) {
      // 编辑现有食材
      setIngredients(ingredients.map(item =>
        item.id === editingIngredient.id
          ? { ...ingredient, id: item.id }
          : item
      ))
    } else {
      // 添加新食材
      setIngredients([
        ...ingredients,
        { ...ingredient, id: Date.now().toString() }
      ])
    }
    setFormOpen(false)
    setEditingIngredient(undefined)
  }
  
  // 处理编辑食材
  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient)
    setFormOpen(true)
  }
  
  // 处理删除食材
  const handleDelete = (ingredient: Ingredient) => {
    setIngredients(ingredients.filter(item => item.id !== ingredient.id))
  }
  
  // 计算剩余保质期天数
  const calculateRemainingDays = (expirationDate: string) => {
    const today = new Date()
    const expDate = new Date(expirationDate)
    const diffTime = expDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  
  // 过滤当前分类的食材
  const filteredIngredients = ingredients.filter(item => {
    if (currentCategory === '即将过期') {
      return calculateRemainingDays(item.expirationDate) <= 5
    }
    return currentCategory === '全部' || item.category === currentCategory
  })
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          我的冰箱
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setWhatToEatOpen(true)}
          >
            今天吃什么
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setEditingIngredient(undefined)
              setFormOpen(true)
            }}
          >
            添加食材
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <CategoryNav
          categories={categories}
          currentCategory={currentCategory}
          onCategoryChange={setCurrentCategory}
        />
        
        <Box sx={{ flexGrow: 1 }}>
          <IngredientList
            ingredients={filteredIngredients}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Box>
      </Box>
      
      <IngredientForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingIngredient}
        categories={categories}
      />

      <WhatToEatDialog
        open={whatToEatOpen}
        onClose={() => setWhatToEatOpen(false)}
        ingredients={ingredients}
      />
    </Container>
  )
}

export default App
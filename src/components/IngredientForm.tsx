import React, { useState, useCallback, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
} from '@mui/material'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import { Ingredient } from '../App'

interface IngredientFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (ingredient: Omit<Ingredient, 'id'>) => void
  initialData?: Ingredient
  categories: string[]
}

const IngredientForm: React.FC<IngredientFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  categories,
}) => {
  const [formData, setFormData] = useState<Omit<Ingredient, 'id'>>({    
    category: '',
    name: '',
    image: '',
    productionDate: '',
    expirationDate: '',
    quantity: 1,
    unit: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        category: initialData.category,
        name: initialData.name,
        image: initialData.image,
        productionDate: initialData.productionDate,
        expirationDate: initialData.expirationDate,
        quantity: initialData.quantity,
        unit: initialData.unit
      })
    }
  }, [initialData])

  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件！')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormData(prev => ({
          ...prev,
          image: e.target.result as string
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }))
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? '编辑食材' : '添加食材'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>分类</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label="分类"
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="name"
              label="名称"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="quantity"
                label="数量"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 0, step: 0.1 }}
              />
              <TextField
                name="unit"
                label="单位"
                value={formData.unit}
                onChange={handleChange}
                fullWidth
                required
                placeholder="如：个、克、包"
              />
            </Box>

            <TextField
              name="productionDate"
              label="生产日期"
              type="date"
              value={formData.productionDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="expirationDate"
              label="过期日期"
              type="date"
              value={formData.expirationDate}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Box
            sx={{
              mt: 2,
              p: 2,
              border: '2px dashed',
              borderColor: dragActive ? 'primary.main' : 'grey.300',
              borderRadius: 1,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: dragActive ? 'action.hover' : 'background.paper',
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography>
              {formData.image ? '点击或拖拽更换图片' : '点击或拖拽上传图片'}
            </Typography>
            {formData.image && (
              <Box sx={{ mt: 2, maxWidth: '200px', mx: 'auto' }}>
                <img
                  src={formData.image}
                  alt="食材图片"
                  style={{ width: '100%', height: 'auto' }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>取消</Button>
          <Button type="submit" variant="contained">
            确定
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default IngredientForm
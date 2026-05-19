'use client'

import { UploadCloud } from 'lucide-react'
import { useState, useRef } from 'react'
import { Card } from '@/components/ui/card'

interface UploadBoxProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
}

export function UploadBox({ onFileSelect, accept = '.pdf,.doc,.docx', maxSize = 10 * 1024 * 1024 }: UploadBoxProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [error, setError] = useState<string>('')
  const fileInput = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const validateFile = (file: File) => {
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / 1024 / 1024}MB`)
      return false
    }
    const validTypes = accept.split(',').map((t) => t.trim())
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!validTypes.includes(fileExt)) {
      setError(`File type must be one of: ${accept}`)
      return false
    }
    setError('')
    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    handleDrag(e)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    }
  }

  return (
    <>
      <Card
        className={`border-2 border-dashed cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInput.current?.click()}
      >
        <div className="p-8 text-center">
          <UploadCloud className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-1">Drop your resume here</h3>
          <p className="text-sm text-muted-foreground mb-3">or click to browse (PDF, DOC, DOCX)</p>
          <p className="text-xs text-muted-foreground">Maximum file size: {maxSize / 1024 / 1024}MB</p>
        </div>
      </Card>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      <input
        ref={fileInput}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </>
  )
}

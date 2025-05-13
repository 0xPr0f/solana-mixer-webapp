import React from 'react'
import { ModalProvider, useModal } from '@/components/modal-provider'
const Cover = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ModalProvider>{children}</ModalProvider>
    </div>
  )
}

export default Cover

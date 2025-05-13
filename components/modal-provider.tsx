'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type ComponentType,
} from 'react'
import { Modal } from '@/components/modal'

interface ModalContextType {
  openModal: (renderFn: ComponentType<any>, title?: string, props?: any) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
})

export const useModal = () => useContext(ModalContext)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [ContentComponent, setContentComponent] =
    useState<ComponentType<any> | null>(null)
  const [contentProps, setContentProps] = useState<any>({})
  const [modalTitle, setModalTitle] = useState<string>()

  const openModal = useCallback(
    (renderFn: ComponentType<any>, title?: string, props: any = {}) => {
      setContentComponent(() => renderFn)
      setContentProps(props)
      setModalTitle(title)
      setIsOpen(true)
    },
    []
  )

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => {
      setContentComponent(null)
      setContentProps({})
      setModalTitle(undefined)
    }, 300)
  }, [])

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      <Modal isOpen={isOpen} onClose={closeModal} title={modalTitle}>
        {ContentComponent ? <ContentComponent {...contentProps} /> : null}
      </Modal>
    </ModalContext.Provider>
  )
}

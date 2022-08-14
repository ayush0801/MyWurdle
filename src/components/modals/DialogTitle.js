import { Dialog } from '@headlessui/react'

export const DialogTitle = ({title}) => 
<Dialog.Title
    as="h3"
    className="text-lg leading-6 font-medium text-gray-900"
>
    {title}
</Dialog.Title>
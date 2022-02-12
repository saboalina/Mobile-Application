import {Button, Modal, Text, useToast} from "native-base";


export default function DeleteModal ({showConfirmModal, setShowConfirmModal, deleteElementModal}) {
    const toast = useToast()

    return(<Modal isOpen={showConfirmModal} onClose={()=>{setShowConfirmModal(false)}}>
        <Modal.Content>
            <Modal.Header><Modal.CloseButton/></Modal.Header>
            <Modal.Body>
                <Text>Are you sure you want to delete this element?</Text>
            </Modal.Body>
            <Modal.Footer>
                <Button.Group space={2}>
                    <Button
                        variant={"ghost"}
                        colorScheme={"blueGray"}
                        onPress={()=> {setShowConfirmModal(false)}}
                    >Cancel</Button>
                    <Button
                        onPress={()=> {
                            deleteElementModal()
                        }}>
                        Da
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal.Content>
    </Modal>)
}

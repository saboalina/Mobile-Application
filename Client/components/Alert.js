import {Alert, Box, CloseIcon, Collapse, HStack, IconButton, Text, VStack} from "native-base";
import React from 'react'
// message primary + message secondary
export default function ValidationAlert({message, show, setShow}) {
    return(
        <Collapse isOpen={show}>
            <Alert w="100%" status="error">
                <VStack space={1} flexShrink={1} w="100%">
                    <HStack
                        flexShrink={1}
                        space={2}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <HStack flexShrink={1} space={2} alignItems="center">
                            <Alert.Icon />
                            <Text
                                fontSize="md"
                                fontWeight="medium"
                                _dark={{
                                    color: "coolGray.800",
                                }}
                            >
                                {message.primary}

                            </Text>
                        </HStack>
                        <IconButton
                            variant="unstyled"
                            icon={<CloseIcon size="3" color="coolGray.600" />}
                            onPress={() => setShow(false)}
                        />
                    </HStack>
                    <Box
                        pl="6"
                        _dark={{
                            _text: {
                                color: "coolGray.600",
                            },
                        }}
                    >
                        {message.secondary}

                    </Box>
                </VStack>
            </Alert>
        </Collapse>)
}
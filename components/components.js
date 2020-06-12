import { Component } from "react";
import { mdiMenu, mdiAccount } from '@mdi/js'
import Icon, { Stack } from '@mdi/react';

export class btnMenu extends Component {
    render() {
        return (
            <Stack color="#444">
                <Icon path={mdiAccount} />
                <Icon path={mdiMenu}
                    color="red" />
            </Stack>
        );
    }
} 
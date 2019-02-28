# VSCode Compound Debugger Configuration Tasks in a Split Terminal

In this repository I explore whether it is possible to have VS Code launch
tasks from a compound debugger configuration in individual but split terminals
in the Integrated Terminal pane in VS Code.

The first step to trying this out is to get a compound terminal configuration.
Go to the Debug pane in VS Code, select No Configurations and then Add
Configuration. Select NodeJS and inspect launch.json.

This gives us one configuration, and as per https://code.visualstudio.com/docs/editor/debugging#_compound-launch-configurations
we will update the JSON array in the `launch.json` file to contain two configurations
and we will make them both NodeJS for a purpose of simplicity in the demo.

The final configuration should look like this:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "FE",
            "program": "${workspaceFolder}/fe/index.js",
        },
        {
            "type": "node",
            "request": "launch",
            "name": "BE",
            "program": "${workspaceFolder}/be/index.js"
        }
    ],
    "compounds": [
        {
            "name": "FE+BE",
            "configurations": [
                "FE",
                "BE"
            ]
        }
    ]
}
```

Both the FE and BE `index.js` file just stall so that the process doesn't end:

```js
void async function stall() {
    await new Promise(resolve => {});
}
```

Running the compound debug configuration we can see the output pane has a switcher
for us and there are no terminal windows open.

We need to add a `preLaunchTask` to each configuration in order to start seeing
these terminal windows to which we could apply the group ID and try to get them
to split by it.

https://code.visualstudio.com/docs/editor/tasks

This is how our `tasks.json` looks like:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "A task",
            "type": "shell",
            "command": "echo 'A'",
            "group": "none",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "dedicated",
                "showReuseMessage": false,
                "clear": true
            }
        },
        {
            "label": "B task",
            "type": "shell",
            "command": "echo 'B'",
            "group": "none",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "dedicated",
                "showReuseMessage": false,
                "clear": true
            }
        }
    ]
}
```

And this is the updated `launch.json` using those tasks:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "FE",
            "program": "${workspaceFolder}/fe/index.js",
            "preLaunchTask": "A task"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "BE",
            "program": "${workspaceFolder}/be/index.js",
            "preLaunchTask": "B task"
        }
    ],
    "compounds": [
        {
            "name": "FE+BE",
            "configurations": [
                "FE",
                "BE"
            ]
        }
    ]
}
```

Running debug now we can see two task terminals do indeed pop up.

Now supposedly adding a `group` value to both tasks, which is the same,
should make them open in one terminal pane, split side-by-side, if I am reading
this right:

https://github.com/Microsoft/vscode/commit/7a9f7e5e1f7abf234d25b69a81885f22e84753d9

But not only does that not work for me, additionally, the `group` field values
are limited to a closed set of values, not free-form.

VS Code issue: https://github.com/Microsoft/vscode/issues/69619

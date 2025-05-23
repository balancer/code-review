export const rateProviderRateRevertRule = {
    agentType: 'blankAgentBuilder',
    agentName: 'Base - getRate health check',
    state: 'enabled',
    rule: {
        chain: 'ethereum',
        triggerType: 'time_based_trigger',
        severity: 'medium',
        contractAddress: '0x565986Cc0c7507d45062e9Bd805328596c294559',
        involvedAssets: {},
        secrets: {},
        input: [],
        inputDataType: [],
        outputDataType: [],
        idlJson: {},
        contractFunctionObject: {},
        outputIndex: '',
        funcSig: '',
        time_based_trigger: {
            type: 'time_based_trigger',
            severity: 'medium',
            period: 1,
            period_unit: 'blocks',
            chain: 'ethereum',
        },
        fileName: 'some_file_name.json',
        operands: [],
        operator: '',
        data_retention_required: false,
        conditions: [
            {
                output_index: '',
                operator: '',
                operands: [],
            },
            {
                operator: 'formula',
                output_index: '',
                operands: [
                    {
                        variable_extraction: [
                            {
                                type: 'context',
                                output_index: 'block_timestamp',
                                var_name: 'block_timestamp',
                            },
                            {
                                type: 'context',
                                output_index: 'block_number',
                                var_name: 'block_number',
                            },
                            {
                                type: 'context',
                                output_index: 'chain',
                                var_name: 'chain',
                            },
                            {
                                type: 'gcr',
                                contract_address: '0xe1b1e024f4bc01bdde23e891e081b76a1a914ddd',
                                operands: [],
                                operator: 'nop',
                                block_offset: 0,
                                input: [],
                                input_data_type: [],
                                output_data_type: ['uint256'],
                                output_index: 'output_arg_0',
                                func_sig: 'getRate()',
                                chain: 'base',
                                var_name: 'getRateOutput',
                            },
                            {
                                type: 'json_processing',
                                json_path: 'Z2V0UmF0ZU91dHB1dD1udWxsID8gMTow',
                                json_path_engine: 'jsonata',
                                var_name: 'is_null',
                            },
                            {
                                type: 'json_processing',
                                json_path: 'aXNfbnVsbCA+IDA=',
                                json_path_engine: 'jsonata',
                                var_name: 'condition_0',
                            },
                        ],
                        eval: {
                            sym_expression: 'condition_0',
                            operator: 'compare_exact',
                            operands: [true],
                            custom_description: 'On Base - the getRate() function reverted. contract 0xe1b1..4ddd',
                        },
                    },
                ],
            },
        ],
        isReminderEnabled: false,
        advanced: ['customDescription'],
        customDescription: 'On Base - the getRate() function reverted. contract 0xe1b1..4ddd',
        ruleString: '',
    },
    severity: 'Medium',
    muteDuration: 0,
    channelsConfigurations: [
        {
            id: 2451,
            name: 'rate-provider-alerts',
        },
    ],
    remindersConfigurations: [],
    delay: 600,
    securitySuitIds: [1373],
    graphData: {
        edges: [
            {
                id: 'xy-edge__76ad1bf3-1f12-45d9-a28e-043fd99d0ca8-07b6cf44-db10-47b8-8a89-5c2b43d775e6',
                source: '76ad1bf3-1f12-45d9-a28e-043fd99d0ca8',
                target: '07b6cf44-db10-47b8-8a89-5c2b43d775e6',
            },
            {
                id: 'xy-edge__07b6cf44-db10-47b8-8a89-5c2b43d775e6-6c41586c-ced7-4db6-86cb-fe2f85f73f9e',
                source: '07b6cf44-db10-47b8-8a89-5c2b43d775e6',
                target: '6c41586c-ced7-4db6-86cb-fe2f85f73f9e',
            },
            {
                id: 'xy-edge__6c41586c-ced7-4db6-86cb-fe2f85f73f9e-6aecd52f-8b2f-49f5-9707-12952ef36557',
                source: '6c41586c-ced7-4db6-86cb-fe2f85f73f9e',
                target: '6aecd52f-8b2f-49f5-9707-12952ef36557',
            },
            {
                id: 'xy-edge__6aecd52f-8b2f-49f5-9707-12952ef36557-b6d012b6-03e1-4295-9389-a2288fbfb211',
                source: '6aecd52f-8b2f-49f5-9707-12952ef36557',
                target: 'b6d012b6-03e1-4295-9389-a2288fbfb211',
            },
        ],
        nodes: [
            {
                id: '76ad1bf3-1f12-45d9-a28e-043fd99d0ca8',
                data: {
                    type: 'blocks',
                    chain: 'ethereum',
                    amount: 1,
                },
                type: 'time-based-node',
                measured: {
                    width: 158,
                    height: 99,
                },
                position: {
                    x: 1000,
                    y: -227,
                },
            },
            {
                id: '07b6cf44-db10-47b8-8a89-5c2b43d775e6',
                data: {
                    alias: 'getRateOutput',
                    chain: 'base',
                    input: [],
                    funcSig: 'getRate()',
                    aliasType: 'uint256',
                    description: '',
                    outputIndex: 0,
                    inputDataType: [],
                    outputDataType: ['uint256'],
                    contractAddress: '0xe1b1e024f4bc01bdde23e891e081b76a1a914ddd',
                    contractAddressAlias: '0xe1..4ddd',
                    contractFunctionObject: {
                        name: 'getRate',
                        type: 'function',
                        inputs: [],
                        funcSig: 'getRate()',
                        outputs: [
                            {
                                name: '',
                                type: 'uint256',
                                internalType: 'uint256',
                            },
                        ],
                        stateMutability: 'view',
                    },
                },
                type: 'read-contract-node',
                measured: {
                    width: 269,
                    height: 286,
                },
                position: {
                    x: 710,
                    y: -98,
                },
            },
            {
                id: '6c41586c-ced7-4db6-86cb-fe2f85f73f9e',
                data: {
                    alias: 'is_null',
                    formula: '{{getRateOutput}}=null ? 1:0',
                    aliasType: 'boolean',
                    description: '',
                },
                type: 'calculation-node',
                measured: {
                    width: 269,
                    height: 148,
                },
                position: {
                    x: 1093,
                    y: 68,
                },
            },
            {
                id: '6aecd52f-8b2f-49f5-9707-12952ef36557',
                data: {
                    valueA: 'is_null',
                    valueB: '0',
                    condition: '>',
                    description: '',
                    valueAMultiplier: 0,
                    valueBMultiplier: 0,
                },
                type: 'condition-node',
                measured: {
                    width: 269,
                    height: 84,
                },
                position: {
                    x: 1223,
                    y: 299.82419776916504,
                },
            },
            {
                id: 'b6d012b6-03e1-4295-9389-a2288fbfb211',
                data: {
                    message: 'On Base - the getRate() function reverted. contract 0xe1b1..4ddd',
                    description: '',
                },
                type: 'send-alert-node',
                measured: {
                    width: 269,
                    height: 87,
                },
                position: {
                    x: 1275,
                    y: 455,
                },
            },
        ],
        description: '',
    },
}

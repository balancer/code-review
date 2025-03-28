export const rateProviderUpgradeRule = {
    agentType: 'genericEventDetection',
    agentName: 'rate provider upgrade',
    state: 'enabled',
    rule: {
        chain: 'base',
        funcSig: 'Upgraded(indexed address implementation)',
        fileName: 'abi.json',
        operator: 'compare_exact',
        conditions: [],
        ruleString:
            'On Base: when event is Upgraded(indexed address implementation) (based on ABI of 0xe9..8dbb) is emitted\nand address emitting_contract is 0xe9..8dbb',
        inputDataType: [],
        outputDataType: ['address'],
        contractAddress: '0xe995168d9924d72a4fe45af18edc06b498cb8dbb',
        isReminderEnabled: false,
        transactionParams: [
            {
                operands: ['0xe995168d9924d72a4fe45af18edc06b498cb8dbb'],
                operator: 'compare_exact',
                output_index: 'emitting_contract',
                operandsExponent: [0],
            },
        ],
        contractAddressAlias: '0xe9..8dbb',
        contractFunctionObject: {
            name: 'Upgraded',
            type: 'event',
            inputs: [
                {
                    name: 'implementation',
                    type: 'address',
                    indexed: true,
                    internalType: 'address',
                },
            ],
            funcSig: 'Upgraded(indexed address implementation)',
            outputs: [],
            anonymous: false,
        },
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
    securitySuitIds: [],
}

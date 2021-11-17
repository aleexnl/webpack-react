import { fElement } from ".";


interface RuleConstructor {
    id: string
    number: number
    type: string
    readingType: string
    elements: fElement[]
    triggerCount: number
    active: boolean
    hasErrors: boolean
    disabledElements: string[]
}

// TODO: Update interface doc
interface OpenRuleConstructor extends RuleConstructor {
    /**
         * If the rule can open buys
         */
    openBuys: string;
    /**
     * If the rule can open sells
     */
    openSells: string;
    allowSameType: string;
    allowDifferentType: string;
    openVolType: string;
    porcentage: string;
    volume: string;
}

// TODO: Update interface doc
interface CloseRuleConstructor extends RuleConstructor {
    /**
         * If the rule can close buys
         */
    closeBuys: string;
    /**
     * If the rule can close sells
     */
    closeSells: string;
    closingType: string;
    closingVolume: number;
}
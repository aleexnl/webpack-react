import type { bElement } from "../types";
import type { CloseRuleConstructor, OpenRuleConstructor, RuleConstructor } from "../types/classes";

/**
 * An base rule created from @tradEAsy
 */
export class Rule {
    // TODO: Update interface doc
    /**
    * @tradEAsy generated UUID
    */
    id!: string
    /**
     * @deprecated
     */
    number!: number
    /**
     * Determintaes if a rule opens or closes operations
     */
    type!: string
    /**
     * Candle reading type: closure or tick
     */
    readingType!: string
    /**
     * Elements added to the rule in @tradEAsy
     */
    elements!: bElement[]
    /**
     * Elements added to the rule in @tradEAsy that are in trigger mode
     */
    triggerCount!: number
    /**
     * If rule was desactivated in @tradEAsy
     */
    active!: boolean
    /**
     * If rule had errors during creation in @tradEAsy
     */
    hasErrors !: boolean
    /**
     * Elements that can not be added to this type of rule
     */
    disabledElements!: string[]

    constructor({ id, number, type, readingType, elements, triggerCount, active, hasErrors, disabledElements }: RuleConstructor) {
        this.id = id
        this.number = number
        this.type = type
        this.readingType = readingType
        // Map @tradEAsy elements to @optitrade elements
        this.elements = elements.map(e => { return { element_id: e.id, parameters: e.params.map(p => { return { param_id: p.id, value: p.value } }) } })
        this.triggerCount = triggerCount
        this.active = active
        this.hasErrors = hasErrors
        this.disabledElements = disabledElements
    }
}

/**
 * An open rule created from @tradEAsy
 */
export class OpenRule extends Rule {
    // TODO: Update interface doc
    /**
     * If the rule can open buys
     */
    openBuys!: string;
    /**
     * If the rule can open sells
     */
    openSells!: string;
    allowSameType!: string;
    allowDifferentType!: string;
    openVolType!: string;
    porcentage!: string;
    volume!: string;
    constructor({ openBuys, openSells, allowSameType, allowDifferentType, openVolType, porcentage, volume, ...other }: OpenRuleConstructor) {
        super({ ...other })
        this.openBuys = openBuys
        this.openSells = openSells
        this.allowSameType = allowSameType
        this.allowDifferentType = allowDifferentType
        this.openVolType = openVolType
        this.porcentage = porcentage
        this.volume = volume
    }

}

/**
 * A close rule created from @tradEAsy
 */
export class CloseRule extends Rule {
    // TODO: Update interface doc
    /**
     * If the rule can close buys
     */
    closeBuys!: string;
    /**
     * If the rule can close sells
     */
    closeSells!: string;
    closingType!: string;
    closingVolume!: number;

    constructor({ closeBuys, closeSells, closingType, closingVolume, ...other }: CloseRuleConstructor) {
        super({ ...other })
        this.closeBuys = closeBuys
        this.closeSells = closeSells
        this.closingType = closingType
        this.closingVolume = closingVolume
    }

}
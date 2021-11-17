import Definitions from "../data/definitions.json";
import type { bElement } from "../types/index"
import { OpenRule, CloseRule } from "./classes";

/**
 * Generate open rule elements from rule properties.
 */
function mapOpenRulePropertiesToElement(rule: OpenRule): bElement[] {
    return [{
        element_id: 46,
        parameters: [
            { value: rule.openBuys, param_id: 100 },
            { value: rule.openSells, param_id: 101 },
            { value: rule.allowSameType, param_id: 102 },
            { value: rule.readingType, param_id: 104 },
            { value: rule.allowDifferentType, param_id: 209 }
        ]
    },
    {
        element_id: 8,
        parameters: [
            { value: rule.openVolType, param_id: 578 },
            { value: `${rule.volume}`, param_id: 273 },
            { value: `${rule.porcentage}`, param_id: 44 }
        ]
    }];
}

/**
 * Generate close rule elements from rule properties.
 */
function mapCloseRulePropertiesToElement(rule: CloseRule): bElement[] {
    return [{
        element_id: 48,
        parameters: [
            { value: rule.closeBuys, param_id: 110 }, // Cerrar Compras
            { value: rule.closeSells, param_id: 111 }, // Cerrar Ventas
            { value: rule.readingType, param_id: 114 } // Tipo de Lectura
        ]
    }, {
        element_id: 10,
        parameters: [
            { value: rule.closingType, param_id: 415 },
            { value: `${rule.closingVolume}`, param_id: 59 }
        ]
    }];
}

/**
 * Map properties to elements depending on rule type.
 */
function rulePropertiesToElements<T extends OpenRule | CloseRule>(rule: T): bElement[] {
    if (rule instanceof OpenRule) {
        return mapOpenRulePropertiesToElement(rule)
    } else if (rule instanceof CloseRule) {
        return mapCloseRulePropertiesToElement(rule)
    }
    throw new Error("Unexpected Rule type while getting parameters.")


}

/**
 * Function used to generate a rule translation.
 */
export function generateRuleDefinition<T extends OpenRule | CloseRule>(rule: T): string {
    const ruleParameters = rulePropertiesToElements<T>(rule)
    console.log(ruleParameters)
    return `Rule ${rule.id}`;
}
import Definitions from "../data/definitions.json";
import type { definition } from "../types/definition";
import type { bElement } from "../types/index"
import { OpenRule, CloseRule } from "./classes";

console.log(Definitions)

const SEARCH_EXP = new RegExp("(@[\\S]*@)")// TODO: Improve RegExp ?

function resolveParameter(definitionParameter: string, text: string, definition: definition, element: bElement): string {
    const definitionParameterValue = definitionParameter.substring(1, definitionParameter.length - 1) // Get the value between the 2 @

    if (definitionParameterValue === "VALUE") {
        const parameter = element.parameters.find(p => p.param_id === definition.idObject1)
        if (typeof parameter !== "undefined") {
            return text.replace(definitionParameter, parameter.value)
        }
        throw new Error(`Could not find parameter with ID ${definition.idObject1}`)
    } else if (parseInt(definitionParameterValue) && isNaN(parseInt(definitionParameterValue)) === false) {
        const targetDefinition = Definitions.find((d: definition) => d.descriptionId == parseInt(definitionParameterValue))
        if (typeof targetDefinition !== "undefined") {
            return text.replace(SEARCH_EXP, resolveDefinition(targetDefinition.description, targetDefinition, element))
        }
        console.error(`Could not find definition with ID ${definitionParameterValue}`)
    }

    return text.replace(SEARCH_EXP, "Otra cosa")
}

function resolveDefinition(text: string, definition: definition, element: bElement): string {
    const matches = text.match(SEARCH_EXP)
    if (matches) {
        return resolveDefinition(
            resolveParameter(matches[0], text, definition, element) // Resolve parameter function
            , definition // Recursive argument
            , element // Recursive argument
        )
    }
    return text // If there are no more matches

}

async function getElementDefinition(elements: bElement[]) {
    return await Promise.all(elements.map(async e => {
        // TODO: Search definition in DB & filter by lang.
        const definition = Definitions.find(d => d.type == "ELEMENT" && d.idObject1 === e.element_id && d.langId === "ES")
        // If no definition is found.
        if (typeof definition === 'undefined') return `No translation found for element with id ${e.element_id}`
        return resolveDefinition(definition.description, definition, e)
    }))
}

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
export async function generateRuleDefinition<T extends OpenRule | CloseRule>(rule: T) {
    const ruleParameters = rulePropertiesToElements<T>(rule)
    const ruleDefinition = await getElementDefinition(ruleParameters)
    const elementDefinition = await getElementDefinition(rule.elements)

    return [...ruleDefinition, ...elementDefinition];
}

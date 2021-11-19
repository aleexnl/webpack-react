import definitionsJson from "../data/definitions.json";
import type { definition } from "../types/definition";
import type { bElement, bParameter } from "../types/index"
import { OpenRule, CloseRule } from "./classes";

const Definitions = definitionsJson.filter((djson: definition) => djson.buySell === "B" || "BS")
const SEARCH_EXP = new RegExp("(@[\\S]*@)")// TODO: Improve RegExp ?

/**
 * Return the definition based on its dependencies
 * compared with a configured element.
*/
function filterDefinitionDependencies(definitions: definition[], element: bElement): definition | undefined {
    const definitionOptions = definitions.map((d) => {
        const definitionOption: { id: number, options: bParameter[] } = { id: d.id, options: [] } // TODO Move type to file
        let lastKey: number = 1
        while (true) {
            if (d[`idObject${lastKey}`] === null) {
                break
            }
            definitionOption.options.push({ param_id: d[`idObject${lastKey}`], value: d[`value${lastKey}`] })
            lastKey = lastKey + 1
        }
        return definitionOption
    })
    const requieredParametersId: number[] = definitionOptions[0].options.map((o: any) => parseInt(o.param_id))
    const userConfiguration: any = requieredParametersId.map(rp => {
        return element.parameters.find(p => p.param_id === rp)
    })
    const target = definitionOptions.find(d => {
        const results = []
        for (let i = 0; i < d.options.length; i++) {
            const option = d.options[i];
            const userOption = userConfiguration[i]
            if (option.value == userOption.value) { results.push(true) } else { results.push(false) }
        }
        if (results.every(r => r === true)) return d
    })
    return definitions.find(d => d.id === target?.id)

}

/**
 * Resolve an @*@ parameter in a definition recursively, 
 * until it gets a full text
*/
function resolveParameter(definitionParameter: string, text: string, definition: definition, element: bElement): string {
    // Get the parameter between the @
    const definitionParameterValue = definitionParameter.substring(1, definitionParameter.length - 1) // Get the value between the 2 @
    // COnvert to integer for further use
    const definitionId = parseInt(definitionParameterValue)

    if (definitionParameterValue === "VALUE") {
        // TODO: Create abstraction in function.
        // Find the parameter needed by the definition
        const parameter = element.parameters.find(p => p.param_id === definition.idObject1)
        if (typeof parameter !== "undefined") {
            // Replace the text with the configured parameter value
            return text.replace(definitionParameter, parameter.value)
        }
        throw new Error(`Could not find parameter with ID ${definition.idObject1}`)
    } else if (isNaN(definitionId) === false) {
        // Get all parameter definitions needed
        const targetDefinitions = Definitions.filter((d: definition) => d.descriptionId == definitionId)
        if (targetDefinitions.length === 1) {
            // TODO: Create abstraction in function.
            const target = targetDefinitions[0]
            return text.replace(SEARCH_EXP, resolveDefinition(target.description, target, element))
        } else if (targetDefinitions.length > 1) {
            // TODO: Create abstraction in function.
            const target = filterDefinitionDependencies(targetDefinitions, element)
            if (target) return text.replace(SEARCH_EXP, resolveDefinition(target.description, target, element))
            console.error(`Error after matching user element config with definition`)
        }
        console.error(`Could not find definition with ID ${definitionParameterValue}`)
        return text.replace(SEARCH_EXP, "Undefined parameter definition")
    }

    return text.replace(SEARCH_EXP, "Albarikokes")
}

/**
 * Resolve an element definition recursively.
 */
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

/**
 * Generate all elements definitions asyncronously
 */
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
function mapOpenRuleToElement(rule: OpenRule): bElement {
    // Creamos un elemento ficticio para almacenar todos
    // los parametros en un elemento.
    return {
        element_id: 46,
        parameters: [
            { value: rule.openBuys, param_id: 100 },
            { value: rule.openSells, param_id: 101 },
            { value: rule.allowSameType, param_id: 102 },
            { value: rule.readingType, param_id: 104 },
            { value: rule.allowDifferentType, param_id: 209 },
            { value: rule.openVolType, param_id: 578 },
            { value: `${rule.volume}`, param_id: 273 },
            { value: `${rule.porcentage}`, param_id: 44 }
        ]
    };
}

/**
 * Generate close rule elements from rule properties.
 */
function mapCloseRuleToElement(rule: CloseRule): bElement {
    // Creamos un elemento ficticio para almacenar todos
    // los parametros en un elemento.
    return {
        element_id: -2,
        parameters: [
            { value: rule.closeBuys, param_id: 110 }, // Cerrar Compras
            { value: rule.closeSells, param_id: 111 }, // Cerrar Ventas
            { value: rule.readingType, param_id: 114 }, // Tipo de Lectura
            { value: rule.closingType, param_id: 415 },
            { value: `${rule.closingVolume}`, param_id: 59 }
        ]
    };
}

/**
 * Map properties to elements depending on rule type.
 */
function rulePropertiesToElement<T extends OpenRule | CloseRule>(rule: T): bElement {
    if (rule instanceof OpenRule) {
        return mapOpenRuleToElement(rule)
    } else if (rule instanceof CloseRule) {
        return mapCloseRuleToElement(rule)
    }
    throw new Error("Unexpected Rule type while getting parameters.")
}

/**
 * Get rule definition from it's parameters &
 * elements.
 */
function getRuleDefinition(type: string, rule: bElement, elements: bElement[]): string {
    const typeID = type === "open" ? "OPEN_RULE" : "CLOSE_RULE"
    const targetDefinition = Definitions.find(d => d.type === typeID)
    if (typeof targetDefinition !== "undefined") {
        const definition = resolveDefinition(targetDefinition.description, targetDefinition, rule)
        return definition
    }
    return `No definition found for ${type} rule`
}

/**
 * Function used to generate a rule translation.
 */
export async function generateRuleDefinition<T extends OpenRule | CloseRule>(rule: T): Promise<string> {
    const ruleElement = rulePropertiesToElement<T>(rule)
    const ruleDefinition = getRuleDefinition(rule.type, ruleElement, rule.elements)
    const elementDefinitions = await getElementDefinition(rule.elements)
    return ruleDefinition.replace("#ELEMENTSCONDITIONS#", elementDefinitions.join("\n"));
}

import { useEffect, useState } from "react";
import ReactDom from "react-dom";
import { generateRuleDefinition } from "./helpers/definition";
// Styles
import "./css/style.css";
// Data
import Strategy from "./data/strategy.json";
import { CloseRule, OpenRule } from "./helpers/classes";


const App = () => {
    const [ruleDefinitions, setRuleDefinitions] = useState<string[][]>([])

    useEffect(() => {

        const createDefinitions = async () => {
            // Merge open rules & close rules in the same array.
            const rules = [...Strategy.openScenario, ...Strategy.closeScenario]

            // Create a mapped rule array where rules are instantiated & declared objects
            const mappedRules = await Promise.all(rules.map(async (r: any) => r.type === "open" ? new OpenRule(r) : new CloseRule(r)))

            // Generate all rules definitions 
            const ruleDefinitions = await Promise.all(mappedRules.map(async (r) => generateRuleDefinition(r)));
            // TODO: Work with rule definitions to generate scenario definitions

            setRuleDefinitions(ruleDefinitions)
        }

        createDefinitions()

        return () => { };
    }, []);

    return <>
        <h1>Definición de la Estrategia</h1>
        <ol>
            {ruleDefinitions.map((r, i) => <li key={i}>
                <ul>
                    {r.map((d, j) => <li key={j}>{d}</li>)}
                </ul>
            </li>)}
        </ol>
    </>;
};

ReactDom.render(<App />, document.getElementById("root"));

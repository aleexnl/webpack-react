/**
 * A parameter that @optitrade can read
 */
export interface bParameter {
    /**
     * Parameter database ID
     */
    param_id: number;
    /**
     * Parameter value
     */
    value: string;
}

/**
 * An element created from @tradEAsy
 */
export interface fElement {
    /**
     * Element database ID
     */
    id: number;
    /**
     * @tradEAsy generated UUID 
     */
    number: string;
    /**
     * Element reference in DB
     */
    name: string;
    /**
     * Element image route
     */
    image: string;
    /**
     * Element parameters
     */
    params: any[]; // TODO: Create fParameter type
    /**
     * Boolean that determintaes if element can be validated in tick validations
     */
    tickAvailable: boolean;
    disabledElements: number[]
}

/**
 * An element that @optitrade can read
 */
export interface bElement {
    /**
     * ELement database ID
     */
    element_id: number;
    /**
     * All element parameters
     */
    parameters: bParameter[]; // TODO: Create bParameter type
}



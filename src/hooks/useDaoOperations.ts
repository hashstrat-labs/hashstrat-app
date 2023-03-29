
import { useCall } from "@usedapp/core"
import { DaoOperationsContract } from "../utils/network"


export const useCollectableFees = (chainId: number) => {

    const contract = DaoOperationsContract(chainId)
    const { value } = useCall({
        contract: contract,
        method: 'collectableFees',
        args: [],
    }) ?? {}

    return value?.[0]
}

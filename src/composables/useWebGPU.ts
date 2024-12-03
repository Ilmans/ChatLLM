type GPUDeviceInfo = {
    adapter: GPUAdapter | null;
    device: GPUDevice | null;
    adapterInfo: GPUAdapterInfo | null;
    checked: boolean;
    unsupportedReason: string | null;
};

export const useWebGPU = () => {
    let adapter
    let device
    const isWebGPUSupported = async () => {
        try {
            if (!navigator.gpu) {
                return false
            }
            adapter = await navigator.gpu.requestAdapter()
            if(!adapter) {
                return false 
            }
    
            device = await adapter.requestDevice()
            return true 
        }catch(e){
            return false
        }
    }

    return {
        adapter,
        device,
        isWebGPUSupported
    }
}
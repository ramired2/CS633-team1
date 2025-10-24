import {RotatingLines, TailSpin} from "react-loader-spinner"

const Spinner = () =>{
    return (
        <TailSpin
          visible={true}
            height="80"
            width="80"
            color="#CC0000"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
        />
    )
}

export default Spinner;
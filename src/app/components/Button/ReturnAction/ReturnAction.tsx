interface Props {
    action: () => void
}

export default function ReturnAction({
    action
}: Props) {
    return (
        <button onClick={action} className='flex items-center gap-2 hover:underline'>
            <svg width='10' height='10' className='' viewBox="0 0 21 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.84623 17.9995L19.4231 31.5765C19.8847 32.038 20.1208 32.6181 20.1315 33.3169C20.1422 34.0155 19.9061 34.6063 19.4231 35.0892C18.9403 35.5721 18.3548 35.8136 17.6668 35.8136C16.9788 35.8136 16.3934 35.5721 15.9105 35.0892L0.929731 20.1084C0.617731 19.7965 0.397647 19.4674 0.26948 19.1213C0.141258 18.7752 0.0771484 18.4012 0.0771484 17.9995C0.0771484 17.5978 0.141258 17.2239 0.26948 16.8778C0.397647 16.5316 0.617731 16.2025 0.929731 15.8906L15.9105 0.909855C16.372 0.448299 16.9521 0.212188 17.6508 0.201521C18.3495 0.190799 18.9403 0.42691 19.4231 0.909855C19.9061 1.39274 20.1476 1.97819 20.1476 2.66619C20.1476 3.35419 19.9061 3.93963 19.4231 4.42252L5.84623 17.9995Z" fill="#546982" />
            </svg>
            return
        </button>
    )
}
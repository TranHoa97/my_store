import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Result } from 'antd';

const ErrorPage = () => {

    const params = useParams()
    const navigate = useNavigate()

    const [message, setMessage] = useState(null)

    useEffect(() => {
        switch (params.slug) {
            case "403":
                setMessage("Sorry, you are not authorized to access this page.")
                break;
            case "404":
                setMessage("Sorry, the page you visited does not exist.")
                break;
            case "500":
                setMessage("Sorry, something went wrong.")
                break;
        }
    }, [])

    return (
        <Result
            status={params.slug}
            title={params.slug}
            subTitle={message}
            extra={
                <Button
                    type="primary"
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
            }
        />
    )
}

export default ErrorPage
import React, { useEffect, useState } from 'react';

export const MyComponent = () => {
    const [registerComponent, setRegisterComponent] = useState(null);

    useEffect(() => {
        const fetchRegisterComponent = async () => {
            try {
                const response = await fetch('/register');
                const registerComponent = await response.text();
                setRegisterComponent(registerComponent);
            } catch (error) {
                console.error('Error fetching Register component:', error);
            }
        };

        fetchRegisterComponent();
    }, []);

    return (
        <div>
            <h1>App Component</h1>
            {registerComponent && <div dangerouslySetInnerHTML={{ __html: registerComponent }} />}
        </div>
    );
};

//  default MyComponent;

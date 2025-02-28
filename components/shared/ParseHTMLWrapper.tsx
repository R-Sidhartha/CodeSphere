import React from "react";
import ParseHTML from "@/components/shared/ParseHTML";

interface Props {
    data: string;
}

const ParseHTMLWrapper = ({ data }: Props) => {
    return <ParseHTML data={data} />;
};

export default ParseHTMLWrapper;

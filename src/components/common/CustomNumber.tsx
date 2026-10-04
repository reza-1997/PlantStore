import { NumberFormatBase, useNumericFormat } from "react-number-format";
import type { NumericFormatProps } from "react-number-format";
import { useParams } from "react-router-dom";


const persianNumeral = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const notPersianNumeral = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];


function CustomNumeralNumericFormat(
    props: NumericFormatProps
) {
    const { format, removeFormatting, ...rest } = useNumericFormat(props);

    const { lang } = useParams<{ lang: string }>()
    const currentNumeral = lang === "fa" ? persianNumeral : notPersianNumeral



    const _format = (val: string | number) => {
        const _val = format?.(String(val)) ?? String(val);

        return _val.replace(/\d/g, ($1) =>
            currentNumeral[Number($1)]
        );
    };

    const _removeFormatting = (val: string) => {
        const _val = val.replace(
            new RegExp(currentNumeral.join("|"), "g"),
            ($1) => String(currentNumeral.indexOf($1))
        );

        return removeFormatting ? removeFormatting(_val) : _val;
    };

    return (
        <NumberFormatBase
            displayType="text"
            format={_format}
            removeFormatting={_removeFormatting}
            {...rest}
        />
    );
}

export default CustomNumeralNumericFormat;
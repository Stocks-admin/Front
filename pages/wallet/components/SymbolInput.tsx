import { SymbolQuery } from "@/models/transactionModel";
import { searchSymbol } from "@/services/searchServices";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import dollarSign from "../assets/dollar-sign.png";
import useClickOutside from "@/hooks/useClickOutside";

interface IProps {
  setValue: UseFormSetValue<any>;
}

const SymbolInput = ({ setValue }: IProps) => {
  const [inputValue, setInputValue] = useState("");
  const [symbolsFound, setSymbolsFound] = useState<SymbolQuery[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const refSearch = useClickOutside(() => setIsSearchOpen(false));

  const handleSearch = useCallback(
    debounce((value: string) => {
      if (value.length === 0) {
        setSymbolsFound([]);
        setIsSearchOpen(false);
        return;
      }

      searchSymbol(value)
        .then((res) => {
          setSymbolsFound(res.data);
          setIsSearchOpen(true);
        })
        .catch((err) => {
          setSymbolsFound([]);
        });
    }, 500),
    []
  );

  const onSelectOption = (symbol: string, market: string) => {
    setValue("symbol", symbol);
    setValue("market", market?.toLowerCase());
    setInputValue(symbol);
    setIsSearchOpen(false);
  };

  useEffect(() => {
    if (inputValue !== "") handleSearch(inputValue);
  }, [inputValue]);

  let symbolType = "";

  return (
    <div className="relative" ref={refSearch}>
      <input
        className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
        type="text"
        placeholder="Buscar simbolo"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => {
          setIsSearchOpen(inputValue.length > 0);
        }}
      />
      {isSearchOpen && (
        <div className="absolute top-10 left-0 w-full bg-white rounded-lg shadow-lg">
          {symbolsFound.length > 0 &&
            symbolsFound.map((symbol) => (
              <>
                {symbol.market !== symbolType &&
                  (symbolType = symbol.market) && (
                    <div className="flex items-center p-2 border-b border-dashed border-gray-200">
                      <span className="text-sm font-light text-center">
                        {symbol.market}
                      </span>
                    </div>
                  )}
                <div
                  className="flex items-center p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  key={symbol.symbol}
                  onClick={() => onSelectOption(symbol.symbol, symbol.market)}
                >
                  {(symbol?.logo || symbol.type === "Currency") && (
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-3 bg-gray-200 rounded-full">
                      <img
                        src={symbol?.logo || dollarSign.src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{symbol.symbol}</span>
                    <span className="text-xs text-gray-400">
                      {symbol.full_name}
                    </span>
                  </div>
                </div>
              </>
            ))}
        </div>
      )}
    </div>
  );
};

export default SymbolInput;

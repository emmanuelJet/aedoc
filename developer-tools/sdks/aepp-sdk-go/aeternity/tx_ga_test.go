package aeternity

import (
	"fmt"
	"math/big"
	"reflect"
	"testing"
)

func TestNewGAAttachTx(t *testing.T) {
	cases := []struct {
		name    string
		tx      Transaction
		wantRLP string
		wantErr bool
	}{
		{
			name: "Example from Python, VMVersion 4, ABIVersion 1",
			tx: &GAAttachTx{
				OwnerID:      "ak_oeoYuVx1wmPxSADDCY6GFVorfJHFYBKia9KonSiWjtbvNQv9Y",
				AccountNonce: 1,
				Code:         "cb_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9246K2XN/CAWn0QFGSjvFGIAAYlXUIBRf2vehD2STuvi98Sjn0btXkSUDTn62IZgndZlXQVNK20SFGIAAg5XUGABGVEAW2AAGVlgIAGQgVJgIJADYABZkIFSgVJZYCABkIFSYCCQA2AAWZCBUoFSWWAgAZCBUmAgkANgA4FSkFlgAFFZUmAAUmAA81tgAIBSYADzW2AA/ZBQkFZbYCABUVGQUFlQgJFQUGAAYABgAGEB9FmQgVJgAGAAWvGAUWAAFGIAASBXgFFgARRiAAFZV1BgARlRAFtQf05vdCBpbiBBdXRoIGNvbnRleHQAAAAAAAAAAAAAAAAAWWAgAZCBUmAgkANgE4FSkFBiAADdVltgIAFRYABRgGAgAVFZYCABkIFSYCCQA2ABYABRUQGBUpBQYABSWVBgAZBQkFCQVltgIAFRgFGQYCABUZFQWVCAgpJQklBQYABgAGAAg1lgIAGQgVJgIJADhYFSWWBAAZCBUmAgkANgABlZYCABkIFSYCCQA2AAWZCBUoFSWWAgAZCBUmAgkANgAFmQgVKBUllgIAGQgVJgIJADYAOBUoFSYCCQA2EBk4FSYABgAFrxkVBQkFZbYCABUVGDklCAkVBQgFlgIAGQgVJgIJADYAGBUllgIAGQgVJgIJADYAAZWWAgAZCBUmAgkANgAFmQgVKBUllgIAGQgVJgIJADYABZkIFSgVJZYCABkIFSYCCQA2ADgVKBUpBQkFaFMy4xLjA3jzdH",
				AuthFunc:     []byte{96, 0, 184, 90, 183, 93, 180, 49, 139, 122, 45, 0, 88, 192, 16, 175, 167, 85, 183, 183, 4, 214, 35, 12, 90, 196, 201, 236, 49, 59, 255, 71},
				VMVersion:    4,
				AbiVersion:   1,
				GasLimit:     *big.NewInt(500),
				GasPrice:     *big.NewInt(1000000000),
				Fee:          *big.NewInt(126720000000000),
				TTL:          0,
				CallData:     "cb_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACBr3oQ9kk7r4vfEo59G7V5ElA05+tiGYJ3WZV0FTSttEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgae21UoMYpb0U8XZCTsTvUGUNeF/kxvl/87SxMDOBYASarBTN",
			},
			wantRLP: "tx_+QoXUAGhAWnttVKDGKW9FPF2Qk7E71BlDXhf5Mb5f/O0sTAzgWAEAbkJOPkJNUYCoCWsKTTRprroz8zCpkqGK2bNOnQoegyDyIlXlhfd3rev+QaS+QIQoGAAuFq3XbQxi3otAFjAEK+nVbe3BNYjDFrEyewxO/9HiWF1dGhvcml6ZbkBoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACg//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYD//////////////////////////////////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+QLroGvehD2STuvi98Sjn0btXkSUDTn62IZgndZlXQVNK20ShGluaXS4wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACg//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALkCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAA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",
			wantErr: false,
		},
		{
			name: "Same as before but different Owner",
			tx: &GAAttachTx{
				OwnerID:      "ak_2a1j2Mk9YSmC1gioUq4PWRm3bsv887MbuRVwyv4KaUGoR1eiKi",
				AccountNonce: 1,
				Code:         "cb_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9246K2XN/CAWn0QFGSjvFGIAAYlXUIBRf2vehD2STuvi98Sjn0btXkSUDTn62IZgndZlXQVNK20SFGIAAg5XUGABGVEAW2AAGVlgIAGQgVJgIJADYABZkIFSgVJZYCABkIFSYCCQA2AAWZCBUoFSWWAgAZCBUmAgkANgA4FSkFlgAFFZUmAAUmAA81tgAIBSYADzW2AA/ZBQkFZbYCABUVGQUFlQgJFQUGAAYABgAGEB9FmQgVJgAGAAWvGAUWAAFGIAASBXgFFgARRiAAFZV1BgARlRAFtQf05vdCBpbiBBdXRoIGNvbnRleHQAAAAAAAAAAAAAAAAAWWAgAZCBUmAgkANgE4FSkFBiAADdVltgIAFRYABRgGAgAVFZYCABkIFSYCCQA2ABYABRUQGBUpBQYABSWVBgAZBQkFCQVltgIAFRgFGQYCABUZFQWVCAgpJQklBQYABgAGAAg1lgIAGQgVJgIJADhYFSWWBAAZCBUmAgkANgABlZYCABkIFSYCCQA2AAWZCBUoFSWWAgAZCBUmAgkANgAFmQgVKBUllgIAGQgVJgIJADYAOBUoFSYCCQA2EBk4FSYABgAFrxkVBQkFZbYCABUVGDklCAkVBQgFlgIAGQgVJgIJADYAGBUllgIAGQgVJgIJADYAAZWWAgAZCBUmAgkANgAFmQgVKBUllgIAGQgVJgIJADYABZkIFSgVJZYCABkIFSYCCQA2ADgVKBUpBQkFaFMy4xLjA3jzdH",
				AuthFunc:     []byte{96, 0, 184, 90, 183, 93, 180, 49, 139, 122, 45, 0, 88, 192, 16, 175, 167, 85, 183, 183, 4, 214, 35, 12, 90, 196, 201, 236, 49, 59, 255, 71},
				VMVersion:    4,
				AbiVersion:   1,
				GasLimit:     *big.NewInt(500),
				GasPrice:     *big.NewInt(1000000000),
				Fee:          *big.NewInt(200000000000000),
				TTL:          0,
				CallData:     "cb_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACBr3oQ9kk7r4vfEo59G7V5ElA05+tiGYJ3WZV0FTSttEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgae21UoMYpb0U8XZCTsTvUGUNeF/kxvl/87SxMDOBYASarBTN",
			},
			wantRLP: "tx_+QoXUAGhAc6nreRwyfmdnU5ACICobx1Ju0RLYvEanrtku8/rc/7zAbkJOPkJNUYCoCWsKTTRprroz8zCpkqGK2bNOnQoegyDyIlXlhfd3rev+QaS+QIQoGAAuFq3XbQxi3otAFjAEK+nVbe3BNYjDFrEyewxO/9HiWF1dGhvcml6ZbkBoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACg//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYD//////////////////////////////////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+QLroGvehD2STuvi98Sjn0btXkSUDTn62IZgndZlXQVNK20ShGluaXS4wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACg//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALkCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAA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",
			wantErr: false,
		},
	}
	for _, tt := range cases {
		t.Run(fmt.Sprintf("%s EncodeRLP", tt.name), func(t *testing.T) {
			gotRLP, err := SerializeTx(tt.tx)
			if (err != nil) != tt.wantErr {
				t.Errorf("%s error = %v, wantErr %v", tt.name, err, tt.wantErr)
			}
			if gotRLP != tt.wantRLP {
				gotRLPRawBytes, wantRLPRawBytes := getRLPSerialized(gotRLP, tt.wantRLP)
				t.Errorf("%s = \n%v\n%v, want \n%v\n%v", tt.name, gotRLP, gotRLPRawBytes, tt.wantRLP, wantRLPRawBytes)
			}

		})
		t.Run(fmt.Sprintf("%s DecodeRLP", tt.name), func(t *testing.T) {
			tx, err := DeserializeTxStr(tt.wantRLP)
			if (err != nil) != tt.wantErr {
				t.Errorf("%s error = %v, wantErr %v", tt.name, err, tt.wantErr)
			}
			if !(reflect.DeepEqual(tx, tt.tx)) {
				t.Errorf("Deserialized Transaction %+v does not deep equal %+v", tx, tt.tx)
			}
		})
	}
}

﻿//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.0.5.0 (NJsonSchema v10.0.22.0 (Newtonsoft.Json v9.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------

using System.Numerics;

#pragma warning disable 108 // Disable "CS0108 '{derivedDto}.ToJson()' hides inherited member '{dtoBase}.ToJson()'. Use the new keyword if hiding was intended."
#pragma warning disable 114 // Disable "CS0114 '{derivedDto}.RaisePropertyChanged(String)' hides inherited member 'dtoBase.RaisePropertyChanged(String)'. To make the current member override that implementation, add the override keyword. Otherwise add the new keyword."
#pragma warning disable 472 // Disable "CS0472 The result of the expression is always 'false' since a value of type 'Int32' is never equal to 'null' of type 'Int32?'
#pragma warning disable 1573 // Disable "CS1573 Parameter '...' has no matching param tag in the XML comment for ...
#pragma warning disable 1591 // Disable "CS1591 Missing XML comment for publicly visible type or member ..."

namespace BlockM3.AEternity.SDK.Generated.Models
{
    

    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class Contract 
    {
        [Newtonsoft.Json.JsonProperty("code", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Code { get; set; }
    
        [Newtonsoft.Json.JsonProperty("options", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required]
        public CompileOpts Options { get; set; } = new CompileOpts();
    
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class CompileOpts 
    {
        /// <summary>Compiler backend; fate | aevm</summary>
        [Newtonsoft.Json.JsonProperty("backend", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        [Newtonsoft.Json.JsonConverter(typeof(Newtonsoft.Json.Converters.StringEnumConverter))]
        public CompileOptsBackend? Backend { get; set; }
    
        /// <summary>An explicit file system, mapping file names to file content</summary>
        [Newtonsoft.Json.JsonProperty("file_system", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public object FileSystem { get; set; }
    
        /// <summary>Name of contract source file - only used in error messages</summary>
        [Newtonsoft.Json.JsonProperty("src_file", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string SrcFile { get; set; }
    
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class APIVersion 
    {
        /// <summary>API compiler version</summary>
        [Newtonsoft.Json.JsonProperty("api-version", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string ApiVersion { get; set; }
    
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class CompilerVersion 
    {
        /// <summary>Sophia compiler version</summary>
        [Newtonsoft.Json.JsonProperty("version", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Version { get; set; }
    
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class CompilerErrors : System.Collections.ObjectModel.Collection<CompilerError>
    {
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class CompilerError 
    {
        [Newtonsoft.Json.JsonProperty("type", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Type { get; set; }
    
        [Newtonsoft.Json.JsonProperty("pos", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required]
        public ErrorPos Pos { get; set; } = new ErrorPos();
    
        [Newtonsoft.Json.JsonProperty("message", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Message { get; set; }
    
        [Newtonsoft.Json.JsonProperty("context", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Context { get; set; }
    
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class ErrorPos 
    {
        [Newtonsoft.Json.JsonProperty("file", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string File { get; set; }
    
        [Newtonsoft.Json.JsonProperty("line", Required = Newtonsoft.Json.Required.Always)]
        public BigInteger Line { get; set; }
    
        [Newtonsoft.Json.JsonProperty("col", Required = Newtonsoft.Json.Required.Always)]
        public BigInteger Col { get; set; }
    
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class ACI 
    {
        [Newtonsoft.Json.JsonProperty("encoded_aci", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required]
        public object EncodedAci { get; set; } = new object();
    
        [Newtonsoft.Json.JsonProperty("interface", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Interface { get; set; }
    
    
    }
    
    /// <summary>Swagger API description</summary>
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class API 
    {
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class SophiaCallResultInput 
    {
        /// <summary>(Possibly partial) Sophia contract code/interface</summary>
        [Newtonsoft.Json.JsonProperty("source", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Source { get; set; }
    
        [Newtonsoft.Json.JsonProperty("options", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public CompileOpts Options { get; set; }
    
        /// <summary>Name of the called function</summary>
        [Newtonsoft.Json.JsonProperty("function", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Function { get; set; }
    
        /// <summary>Call result type (ok | revert | error)</summary>
        [Newtonsoft.Json.JsonProperty("call-result", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string CallResult { get; set; }
    
        /// <summary>Call result value (ABI encoded data or error string)</summary>
        [Newtonsoft.Json.JsonProperty("call-value", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string CallValue { get; set; }
    
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class SophiaCallResult 
    {
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class SophiaBinaryData 
    {
        [Newtonsoft.Json.JsonProperty("sophia-type", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string SophiaType { get; set; }
    
        [Newtonsoft.Json.JsonProperty("data", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Data { get; set; }
    
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class SophiaJsonData 
    {
        [Newtonsoft.Json.JsonProperty("data", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required]
        public object Data { get; set; } = new object();
    
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class FunctionCallInput 
    {
        /// <summary>(Possibly partial) Sophia contract code</summary>
        [Newtonsoft.Json.JsonProperty("source", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Source { get; set; }
    
        [Newtonsoft.Json.JsonProperty("options", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public CompileOpts Options { get; set; }
    
        /// <summary>Name of function to call</summary>
        [Newtonsoft.Json.JsonProperty("function", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Function { get; set; }
    
        /// <summary>Array of function call arguments</summary>
        [Newtonsoft.Json.JsonProperty("arguments", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required]
        public System.Collections.Generic.ICollection<string> Arguments { get; set; } = new System.Collections.ObjectModel.Collection<string>();
    
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class BytecodeCallResultInput 
    {
        /// <summary>Compiled contract</summary>
        [Newtonsoft.Json.JsonProperty("bytecode", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Bytecode { get; set; }
    
        /// <summary>Name of the called function</summary>
        [Newtonsoft.Json.JsonProperty("function", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Function { get; set; }
    
        /// <summary>Call result type (ok | revert | error)</summary>
        [Newtonsoft.Json.JsonProperty("call-result", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string CallResult { get; set; }
    
        /// <summary>Call result value (ABI encoded data or error string)</summary>
        [Newtonsoft.Json.JsonProperty("call-value", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string CallValue { get; set; }
    
        /// <summary>Compiler backend; fate | aevm</summary>
        [Newtonsoft.Json.JsonProperty("backend", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        [Newtonsoft.Json.JsonConverter(typeof(Newtonsoft.Json.Converters.StringEnumConverter))]
        public BytecodeCallResultInputBackend? Backend { get; set; }
    
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class DecodeCalldataBytecode 
    {
        /// <summary>Calldata to dissect</summary>
        [Newtonsoft.Json.JsonProperty("calldata", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string CallData { get; set; }
    
        /// <summary>Compiled contract</summary>
        [Newtonsoft.Json.JsonProperty("bytecode", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Bytecode { get; set; }
    
        /// <summary>Compiler backend; fate | aevm</summary>
        [Newtonsoft.Json.JsonProperty("backend", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        [Newtonsoft.Json.JsonConverter(typeof(Newtonsoft.Json.Converters.StringEnumConverter))]
        public DecodeCalldataBytecodeBackend? Backend { get; set; }
    
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class DecodeCalldataSource 
    {
        /// <summary>(Possibly partial) Sophia contract code</summary>
        [Newtonsoft.Json.JsonProperty("source", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Source { get; set; }
    
        [Newtonsoft.Json.JsonProperty("options", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public CompileOpts Options { get; set; }
    
        /// <summary>Calldata to dissect</summary>
        [Newtonsoft.Json.JsonProperty("calldata", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string CallData { get; set; }
    
        /// <summary>Name of the function to call</summary>
        [Newtonsoft.Json.JsonProperty("function", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Function { get; set; }
    
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class DecodedCallresult 
    {
        [Newtonsoft.Json.JsonProperty("function", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Function { get; set; }
    
        [Newtonsoft.Json.JsonProperty("result", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required]
        public object Result { get; set; } = new object();
    
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class DecodedCalldata 
    {
        [Newtonsoft.Json.JsonProperty("function", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string Function { get; set; }
    
        [Newtonsoft.Json.JsonProperty("arguments", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required]
        public System.Collections.Generic.ICollection<object> Arguments { get; set; } = new System.Collections.ObjectModel.Collection<object>();
    
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public partial class Calldata 
    {
        [Newtonsoft.Json.JsonProperty("calldata", Required = Newtonsoft.Json.Required.Always)]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = true)]
        public string CallData { get; set; }
    
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public enum CompileOptsBackend
    {
        [System.Runtime.Serialization.EnumMember(Value = @"fate")]
        Fate = 0,
    
        [System.Runtime.Serialization.EnumMember(Value = @"aevm")]
        Aevm = 1,
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public enum BytecodeCallResultInputBackend
    {
        [System.Runtime.Serialization.EnumMember(Value = @"fate")]
        Fate = 0,
    
        [System.Runtime.Serialization.EnumMember(Value = @"aevm")]
        Aevm = 1,
    
    }
    
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "10.0.22.0 (Newtonsoft.Json v9.0.0.0)")]
    public enum DecodeCalldataBytecodeBackend
    {
        [System.Runtime.Serialization.EnumMember(Value = @"fate")]
        Fate = 0,
    
        [System.Runtime.Serialization.EnumMember(Value = @"aevm")]
        Aevm = 1,
    
    }

}

#pragma warning restore 1591
#pragma warning restore 1573
#pragma warning restore  472
#pragma warning restore  114
#pragma warning restore  108
﻿using System.Numerics;
using System.Threading;
using System.Threading.Tasks;
using BlockM3.AEternity.SDK.Generated.Models;
using BlockM3.AEternity.SDK.Utils;
using Microsoft.Extensions.Logging;

namespace BlockM3.AEternity.SDK.Transactions.Channels
{
    public class ChannelCloseSoloTransaction : Transaction<UnsignedTx, ChannelCloseSoloTx>
    {
        internal ChannelCloseSoloTransaction(ILoggerFactory factory, FlatClient client) : base(factory, client)
        {
        }

        public override BigInteger Fee
        {
            get => Model.Fee;
            set => Model.Fee = (ulong) value;
        }

        protected override Task<UnsignedTx> CreateDebugAsync(CancellationToken token)
        {
            return _client.CreateDebugChannelCloseSoloAsync(Model, token);
        }

        public override byte[] Serialize()
        {
            RLPEncoder enc = new RLPEncoder();
            enc.AddInt(Constants.SerializationTags.OBJECT_TAG_CHANNEL_CLOSE_SOLO_TRANSACTION);
            enc.AddInt(Constants.SerializationTags.VSN);
            enc.AddByteArray(Encoding.DecodeCheckAndTag(Model.ChannelId, Constants.SerializationTags.ID_TAG_ACCOUNT));
            enc.AddByteArray(Encoding.DecodeCheckAndTag(Model.FromId, Constants.SerializationTags.ID_TAG_ACCOUNT));
            enc.AddString(Model.Payload);
            //Poi
            enc.AddNumber(Model.Ttl);
            enc.AddNumber(Model.Fee);
            enc.AddNumber(Model.Nonce);
            return enc.Encode();
        }
    }
}